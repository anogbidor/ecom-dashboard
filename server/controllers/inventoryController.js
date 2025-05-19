import db from '../db/connection.js'

export const getInventory = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM inventory ORDER BY last_restocked DESC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch inventory data',
      message: err.message,
    })
  }
}
