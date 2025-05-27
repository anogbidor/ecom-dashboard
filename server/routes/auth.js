import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import db from '../db/connection.js'
import verifyToken from '../middleware/verifyToken.js'
import verifyAdmin from '../middleware/verifyAdmin.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

/**
 * 🔐 Admin or Staff Login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  console.log('🔐 Login attempt received:', { email })

  try {
    const [rows] = await db.query(
      'SELECT id, email, username, password, role FROM admin WHERE email = ? OR username = ? LIMIT 1',
      [email, email]
    )

    const user = rows[0]
    console.log('🧑‍💼 Fetched user from DB:', user)

    if (!user) {
      console.warn('⚠️ User not found')
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log('🔍 Password match result:', passwordMatch)

    if (!passwordMatch) {
      console.warn('⚠️ Incorrect password')
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    console.log('✅ Login successful:', {
      name: user.username,
      role: user.role,
      token: token.slice(0, 20) + '...', // partial token for logs
    })

    res.json({
      token,
      user: { name: user.username, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('❌ Login failed:', err.message)
    res.status(500).json({ error: 'Server error during login' })
  }
})

/**
 * 🔑 Forgot Password
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })

  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE email = ?', [
      email,
    ])
    const admin = rows[0]

    if (!admin) {
      return res
        .status(404)
        .json({ error: 'Admin with this email does not exist' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15)

    await db.query(
      'INSERT INTO password_reset_tokens (admin_id, token, expires_at) VALUES (?, ?, ?)',
      [admin.id, token, expiresAt]
    )

    console.log(
      `🔗 Reset link: http://localhost:5173/reset-password?token=${token}`
    )
    res.json({ message: 'Password reset token generated and logged.' })
  } catch (err) {
    console.error('❌ Forgot password error:', err.message)
    res.status(500).json({ error: 'Server error during token generation' })
  }
})

/**
 * 🔄 Reset Password
 */
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body
  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: 'Token and new password are required' })
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    )
    const resetToken = rows[0]

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db.query('UPDATE admin SET password = ? WHERE id = ?', [
      hashedPassword,
      resetToken.admin_id,
    ])

    await db.query('DELETE FROM password_reset_tokens WHERE id = ?', [
      resetToken.id,
    ])

    res.json({ message: 'Password has been reset successfully' })
  } catch (err) {
    console.error('❌ Reset password error:', err.message)
    res.status(500).json({ error: 'Server error during password reset' })
  }
})

/**
 * ✏️ Update Username
 */
router.post('/update-username', verifyToken, async (req, res) => {
  const { newUsername } = req.body
  const adminId = req.user?.id

  if (!newUsername) {
    return res.status(400).json({ error: 'New username is required' })
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM admin WHERE username = ?',
      [newUsername]
    )
    if (existing.length > 0 && existing[0].id !== adminId) {
      return res.status(409).json({ error: 'Username already taken' })
    }

    await db.query('UPDATE admin SET username = ? WHERE id = ?', [
      newUsername,
      adminId,
    ])
    await db.query(
      'INSERT INTO notifications (admin_id, message) VALUES (?, ?)',
      [adminId, `👤 Username updated to "${newUsername}"`]
    )

    res.json({
      message: 'Username updated successfully',
      username: newUsername,
    })
  } catch (err) {
    console.error('❌ Username update error:', err.message)
    res.status(500).json({ error: 'Failed to update username' })
  }
})

/**
 * 🔐 Update Password
 */
router.post('/update-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const adminId = req.user?.id

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [adminId])
    const admin = rows[0]

    const isMatch = await bcrypt.compare(currentPassword, admin.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hashed = await bcrypt.hash(newPassword, 10)

    await db.query('UPDATE admin SET password = ? WHERE id = ?', [
      hashed,
      adminId,
    ])
    await db.query(
      'INSERT INTO notifications (admin_id, message) VALUES (?, ?)',
      [adminId, '🔐 Password changed successfully']
    )

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('❌ Password update error:', err.message)
    res.status(500).json({ error: 'Failed to update password' })
  }
})

/**
 * 🧾 Signup - Public or Admin-Only
 */
router.post('/signup', async (req, res) => {
  const { username, email, password, role = 'staff' } = req.body
  const token = req.headers.authorization?.split(' ')[1]

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM admin WHERE email = ? OR username = ?',
      [email, username]
    )
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email or username already taken' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let requesterRole = null
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        requesterRole = decoded.role
        console.log(
          '🔓 Signup requested by:',
          decoded.email,
          'with role:',
          decoded.role
        )
      } catch (err) {
        return res.status(401).json({ error: 'Invalid token' })
      }
    }

    const assignedRole = requesterRole === 'admin' ? role : 'staff'
    console.log(`🛠 Assigning role "${assignedRole}" to new user "${username}"`)

    await db.query(
      'INSERT INTO admin (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, assignedRole]
    )

    res
      .status(201)
      .json({ message: `User registered as ${assignedRole} successfully` })
  } catch (err) {
    console.error('❌ Sign-up error:', err.message)
    res.status(500).json({ error: 'Failed to register user' })
  }
})

export default router
