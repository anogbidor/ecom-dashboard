import express from 'express'
import {
  getCustomers,
  getCustomerStatsByLocation,
 addCustomer, 
 deleteCustomer
} from '../controllers/customersController.js'

const router = express.Router()

router.get('/', getCustomers)
router.get('/locations', getCustomerStatsByLocation)
router.post('/', addCustomer)
router.delete('/:id', deleteCustomer)

export default router
