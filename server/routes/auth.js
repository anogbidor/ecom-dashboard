import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import db from '../db/connection.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

/**
 * Admin Login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const [rows] = await db.query(
      'SELECT * FROM admin WHERE email = ? OR username = ? LIMIT 1',
      [email, email]
    )

    const user = rows[0]
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({
      token,
      user: { name: user.username, email: user.email },
    })
  } catch (err) {
    console.error('Login failed:', err)
    res.status(500).json({ error: 'Server error during login' })
  }
})

/**
 * Forgot Password - Generate Token
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

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
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15) // 15 min

    await db.query(
      'INSERT INTO password_reset_tokens (admin_id, token, expires_at) VALUES (?, ?, ?)',
      [admin.id, token, expiresAt]
    )

    // In production, send this by email
    console.log(
      `🔗 Reset Link: http://localhost:5173/reset-password?token=${token}`
    )

    res.json({ message: 'Password reset token generated and logged.' })
  } catch (err) {
    console.error('❌ Forgot password error:', err)
    res.status(500).json({ error: 'Server error during token generation' })
  }
})

/**
 * Reset Password - Validate Token and Update Password
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
    console.error('❌ Reset password error:', err)
    res.status(500).json({ error: 'Server error during password reset' })
  }
})


/**
 * Update Username
*/
router.post('/update-username', verifyToken, async (req, res) => {
 const { newUsername } = req.body
 const adminId = req.user?.id

 if (!newUsername) {
   return res.status(400).json({ error: 'New username is required' })
 }

 try {
   // Optional: Check if username already exists
   const [existing] = await db.query(
     'SELECT id FROM admin WHERE username = ?',
     [newUsername]
   )
   if (existing.length > 0 && existing[0].id !== adminId) {
     return res.status(409).json({ error: 'Username already taken' })
   }

   // Update username
   await db.query('UPDATE admin SET username = ? WHERE id = ?', [
     newUsername,
     adminId,
   ])

   // Insert notification
   await db.query(
     'INSERT INTO notifications (admin_id, message) VALUES (?, ?)',
     [adminId, `👤 Username updated to "${newUsername}"`]
   )

   res.json({
     message: 'Username updated successfully',
     username: newUsername,
   })
 } catch (err) {
   console.error('Username update error:', err)
   res.status(500).json({ error: 'Failed to update username' })
 }
})



/**
 * Update Password - With Current Password Verification
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

    // ✅ Insert notification
    await db.query(
      'INSERT INTO notifications (admin_id, message) VALUES (?, ?)',
      [adminId, '🔐 Password changed successfully']
    )

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('Password update error:', err)
    res.status(500).json({ error: 'Failed to update password' })
  }
})

export default router
