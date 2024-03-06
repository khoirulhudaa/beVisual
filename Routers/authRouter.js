const express = require('express')
const router = express.Router()
const authController = require('../Controllers/authController')

router.get('/', authController.getAllUser)
router.post('/signin', authController.signin)
router.post('/signup', authController.signup)
router.post('/delete/:user_id', authController.removeUser)
router.post('/update', authController.updateUser)

module.exports = router