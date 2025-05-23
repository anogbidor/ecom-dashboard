import express from 'express'
import { getInventory, addProduct } from '../controllers/inventoryController.js'

const router = express.Router()

router.get('/', getInventory)
router.post('/', addProduct) 

export default router
