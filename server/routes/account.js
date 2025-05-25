import express from 'express'
import {
  getAccount,
  updateUsername,
  changePassword,
} from '../controllers/authController.js'

const router = express.Router()

// GET /api/account - fetch admin account details
router.get('/', getAccount)

// PUT /api/account/username - update username
router.put('/username', updateUsername)

// PUT /api/account/password - change password
router.put('/password', changePassword)

export default router
