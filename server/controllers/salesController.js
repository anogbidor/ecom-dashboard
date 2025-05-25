import db from '../db/connection.js'

// 📈 Get sales trends
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

// 🔝 Get top 5 products
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

// 💸 Add Sale + 📦 Inventory Update + 🔔 Notification
export const addSale = async (req, res) => {
  const { product_name, quantity, total_price } = req.body
  const adminId = req.user?.id // must come from verifyToken middleware

  if (!product_name || !quantity || !total_price) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const conn = await db.getConnection()

  try {
    await conn.beginTransaction()

    // 1. Lock and check inventory
    const [inventoryRows] = await conn.query(
      'SELECT quantity_in_stock FROM inventory WHERE product_name = ? FOR UPDATE',
      [product_name]
    )

    if (!inventoryRows.length) {
      throw new Error('Product not found in inventory')
    }

    const currentStock = inventoryRows[0].quantity_in_stock
    if (currentStock < quantity) {
      throw new Error('Not enough stock available')
    }

    // 2. Insert sale
    const saleDate = new Date()
    await conn.query(
      'INSERT INTO sales (product_name, quantity, total_price, sale_date) VALUES (?, ?, ?, ?)',
      [product_name, quantity, total_price, saleDate]
    )

    // 3. Update inventory
    await conn.query(
      'UPDATE inventory SET quantity_in_stock = quantity_in_stock - ? WHERE product_name = ?',
      [quantity, product_name]
    )

    // 4. Insert notification with admin_id
    const message = `💰 Sale recorded: ${quantity} ${product_name} for $${total_price}`
    await conn.query(
      'INSERT INTO notifications (admin_id, message) VALUES (?, ?)',
      [adminId, message]
    )

    await conn.commit()
    res.status(201).json({
      message: 'Sale recorded, inventory updated, and notification sent.',
    })
  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message || 'Failed to record sale' })
  } finally {
    conn.release()
  }
}
