import db from '../db/connection.js'

export const getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM customers ORDER BY join_date DESC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch customer data',
      message: err.message,
    })
  }
}

export const getCustomerStatsByLocation = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT location, COUNT(*) AS count
      FROM customers
      GROUP BY location
      ORDER BY count DESC
    `)
    res.json(rows)
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to get customer stats', message: err.message })
  }
}
