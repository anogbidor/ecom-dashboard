import db from '../db/connection.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

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
