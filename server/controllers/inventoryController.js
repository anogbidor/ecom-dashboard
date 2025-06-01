import db from '../db/connection.js'

// 🧾 Get all inventory items
export const getInventory = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM inventory ORDER BY date_added DESC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch inventory data',
      message: err.message,
    })
  }
}

// 🔍 Check if product with the same name exists
export const checkProductExists = async (product_name) => {
  const [rows] = await db.query(
    'SELECT * FROM inventory WHERE product_name = ?',
    [product_name]
  )
  return rows.length > 0 ? rows[0] : null
}

// ➕ Add product with unique name and SKU enforcement
export const addProduct = async (req, res) => {
  const { product_name, sku, quantity_in_stock, price, description } = req.body

  if (!product_name || !sku || quantity_in_stock == null || price == null) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    // Check for existing product name
    const [nameRows] = await db.query(
      'SELECT * FROM inventory WHERE product_name = ?',
      [product_name]
    )
    if (nameRows.length) {
      return res.status(409).json({
        error: 'A product with this name already exists.',
        conflictField: 'product_name',
        existingProduct: nameRows[0],
      })
    }

    // Check for existing SKU
    const [skuRows] = await db.query('SELECT * FROM inventory WHERE sku = ?', [
      sku,
    ])
    if (skuRows.length) {
      return res.status(409).json({
        error: 'A product with this SKU already exists.',
        conflictField: 'sku',
        existingProduct: skuRows[0],
      })
    }

    // Insert new product
    await db.query(
      'INSERT INTO inventory (product_name, sku, quantity_in_stock, price, description) VALUES (?, ?, ?, ?, ?)',
      [product_name, sku, quantity_in_stock, price, description || null]
    )

    res.status(201).json({ message: 'Product added successfully' })
  } catch (err) {
    res.status(500).json({
      error: 'Failed to add product. Please try again later.',
      message: err.message,
    })
  }
}

// 🔁 Update product quantity only
export const updateProductQuantity = async (req, res) => {
  const { product_name, quantity } = req.body

  if (!product_name || quantity === undefined) {
    return res
      .status(400)
      .json({ error: 'Product name and quantity are required' })
  }

  try {
    await db.query(
      'UPDATE inventory SET quantity_in_stock = ? WHERE product_name = ?',
      [quantity, product_name]
    )

    res.status(200).json({ message: 'Quantity updated successfully' })
  } catch (err) {
    res.status(500).json({
      error: 'Failed to update quantity',
      message: err.message,
    })
  }
}

// ❌ Delete product by name
export const deleteProduct = async (req, res) => {
  const { product_name } = req.params

  if (!product_name) {
    return res.status(400).json({ error: 'Product name is required' })
  }

  try {
    await db.query('DELETE FROM inventory WHERE product_name = ?', [
      product_name,
    ])

    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (err) {
    res.status(500).json({
      error: 'Failed to delete product',
      message: err.message,
    })
  }
}

// 🔄 Update full product details (used in conflict modal)
export const updateFullProduct = async (req, res) => {
  const { product_name, sku, quantity_in_stock, price, description } = req.body

  if (!product_name || !sku || quantity_in_stock == null || price == null) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    await db.query(
      'UPDATE inventory SET sku = ?, quantity_in_stock = ?, price = ?, description = ? WHERE product_name = ?',
      [sku, quantity_in_stock, price, description || null, product_name]
    )
    res.status(200).json({ message: 'Product updated successfully' })
  } catch (err) {
    res.status(500).json({
      error: 'Failed to update product',
      message: err.message,
    })
  }
}
