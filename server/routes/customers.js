import express from 'express'
import { getCustomers, getCustomerStatsByLocation } from '../controllers/customersController.js'

const router = express.Router()

router.get('/', getCustomers)
router.get('/locations', getCustomerStatsByLocation)


export default router
