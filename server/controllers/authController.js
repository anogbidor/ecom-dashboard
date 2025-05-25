import db from '../db/connection.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

// ✅ Admin Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE email = ?', [
      email,
    ])

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const admin = rows[0]
    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: '1d',
    })

    res.json({
      message: 'Login successful',
      token,
      user: { id: admin.id, username: admin.username },
    })
  } catch (err) {
    res.status(500).json({ error: 'Login failed', message: err.message })
  }
}

// ✅ Get Account Info
export const getAccount = async (req, res) => {
  try {
    const adminId = req.user.id
    const [rows] = await db.query(
      'SELECT id, username, email FROM admin WHERE id = ?',
      [adminId]
    )
    const admin = rows[0]

    if (!admin) return res.status(404).json({ error: 'Admin not found' })
    res.json(admin)
  } catch (err) {
    console.error('Fetch account error:', err)
    res.status(500).json({ error: 'Failed to fetch account info' })
  }
}

// ✅ Update Username
export const updateUsername = async (req, res) => {
  const adminId = req.user.id
  const { username } = req.body

  if (!username) return res.status(400).json({ error: 'Username is required' })

  try {
    await db.query('UPDATE admin SET username = ? WHERE id = ?', [
      username,
      adminId,
    ])
    res.json({ message: 'Username updated successfully' })
  } catch (err) {
    console.error('Update username error:', err)
    res.status(500).json({ error: 'Failed to update username' })
  }
}

// ✅ Change Password
export const changePassword = async (req, res) => {
  const adminId = req.user.id
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: 'Both old and new passwords are required' })
  }

  try {
    const [rows] = await db.query('SELECT password FROM admin WHERE id = ?', [
      adminId,
    ])
    const admin = rows[0]
    const isMatch = await bcrypt.compare(oldPassword, admin.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Old password is incorrect' })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await db.query('UPDATE admin SET password = ? WHERE id = ?', [
      hashed,
      adminId,
    ])
    res.json({ message: 'Password changed successfully' })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ error: 'Failed to change password' })
  }
}
