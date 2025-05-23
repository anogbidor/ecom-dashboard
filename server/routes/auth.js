import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Mock user credentials
const mockUser = {
  email: 'admin@example.com',
  password: 'admin123', // In production, NEVER store raw passwords
  name: 'Admin User',
}

// Secret key (in production, use env variable!)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

router.post('/login', (req, res) => {
 console.log('📨 Received body:', req.body) 
  const { email, password } = req.body

  if (email === mockUser.email && password === mockUser.password) {
    const token = jwt.sign(
      { email: mockUser.email, name: mockUser.name },
      JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )
    return res.json({ token, user: { name: mockUser.name, email } })
  }

  return res.status(401).json({ error: 'Invalid email or password' })
})

export default router
