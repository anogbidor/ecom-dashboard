import express from 'express'
import {
  getInventory,
  addProduct,
  updateProductQuantity,
  updateFullProduct, 
  deleteProduct,
} from '../controllers/inventoryController.js'

const router = express.Router()

router.get('/', getInventory)
router.post('/', addProduct)
router.patch('/quantity', updateProductQuantity) // For quantity updates
router.delete('/:product_name', deleteProduct)
router.patch('/update', updateFullProduct)// For product deletion

export default router
