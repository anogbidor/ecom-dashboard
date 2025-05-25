import express from 'express'
import db from '../db/connection.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

// ✅ Get all notifications for the logged-in admin
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE admin_id = ? ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    console.error('Error fetching notifications:', err)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// ✅ Create a new notification
router.post('/', verifyToken, async (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }

  try {
    await db.query(
      'INSERT INTO notifications (admin_id, message) VALUES (?, ?)',
      [req.user.id, message]
    )
    res.status(201).json({ message: 'Notification created' })
  } catch (err) {
    console.error('Error creating notification:', err)
    res.status(500).json({ error: 'Failed to create notification' })
  }
})

// ✅ Mark notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND admin_id = ?',
      [req.params.id, req.user.id]
    )
    res.json({ message: 'Notification marked as read' })
  } catch (err) {
    console.error('Error updating notification:', err)
    res.status(500).json({ error: 'Failed to update notification' })
  }
})

export default router
