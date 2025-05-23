import db from '../db/connection.js'

export const addProduct = async (req, res) => {
  const { product_name, sku, quantity_in_stock, price } = req.body
  if (!product_name || !sku || !quantity_in_stock || !price) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    await db.query(
      'INSERT INTO inventory (product_name, sku, quantity_in_stock, price) VALUES (?, ?, ?, ?)',
      [product_name, sku, quantity_in_stock, price]
    )
    res.status(201).json({ message: 'Product added successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Database error', message: err.message })
  }
}
