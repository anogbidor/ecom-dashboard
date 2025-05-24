import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db/connection.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

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

export default router
