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

// Add new customer


export const addCustomer = async (req, res) => {
  const { name, email, location, join_date } = req.body

  if (!name || !email || !location || !join_date) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO customers (name, email, location, join_date) VALUES (?, ?, ?, ?)',
      [name, email, location, join_date]
    )

    const newCustomer = {
      id: result.insertId,
      name,
      email,
      location,
      join_date,
    }

    res.status(201).json(newCustomer)
  } catch (error) {
    console.error('Error adding customer:', error)
    res.status(500).json({ message: 'Server error while adding customer' })
  }
}

// Delete customer
export const deleteCustomer = async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await db.execute('DELETE FROM customers WHERE id = ?', [
      id,
    ])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    res.status(200).json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    res.status(500).json({ message: 'Server error while deleting customer' })
  }
}
