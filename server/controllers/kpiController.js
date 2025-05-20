import db from '../db/connection.js'

export const getKPIs = async (req, res) => {
  try {
    const [[{ totalRevenue }]] = await db.query(`
      SELECT SUM(total_price) AS totalRevenue FROM sales
    `)

    const [[{ totalOrders }]] = await db.query(`
      SELECT COUNT(*) AS totalOrders FROM sales
    `)

    const [[{ totalCustomers }]] = await db.query(`
      SELECT COUNT(*) AS totalCustomers FROM customers
    `)

    const avgOrderValue =
      totalRevenue && totalOrders ? totalRevenue / totalOrders : 0

    res.json({
      totalRevenue: Number(totalRevenue) || 0,
      totalOrders: Number(totalOrders) || 0,
      totalCustomers: Number(totalCustomers) || 0,
      avgOrderValue: Number(avgOrderValue.toFixed(2)),
    })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch KPIs', message: err.message })
  }
}
