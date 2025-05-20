import db from '../db/connection.js'

export const getSalesTrends = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(sale_date) AS date, SUM(total_price) AS total
      FROM sales
      GROUP BY DATE(sale_date)
      ORDER BY date ASC
    `)
    res.json(rows)
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch sales trends', message: err.message })
  }
}

export const getTopProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
     SELECT 
       product_name, 
       SUM(quantity) AS total_quantity,
       SUM(total_price) AS total_revenue
     FROM sales
     GROUP BY product_name
     ORDER BY total_revenue DESC
     LIMIT 5
   `)

    res.json(rows)
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch top products',
      message: err.message,
    })
  }
}