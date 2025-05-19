import express from 'express'
import db from '../db/connection.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sales ORDER BY sale_date DESC')
    res.json(rows)
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch sales data', message: err.message })
  }
})

export default router
