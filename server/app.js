import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './db/connection.js'
import salesRoutes from './routes/sales.js'
import customersRoutes from './routes/customers.js'
import inventoryRoutes from './routes/inventory.js'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())





// Temporary: Test DB connection
db.getConnection()
  .then(() => console.log('✅ MySQL connected'))
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message)
    console.error('🔎 Full error:', err)
  })

// Routes
app.use('/api/sales', salesRoutes)
app.use('/api/customers', customersRoutes)
app.use('/api/inventory', inventoryRoutes)

app.get('/', (req, res) => {
  res.send('API is running...')
})

export default app
