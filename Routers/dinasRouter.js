const express = require('express')
const router = express.Router()
const dinasController = require('../Controllers/dinasController')

router.get('/', dinasController.getAllDinas)
router.post('/', dinasController.createDinas)
router.post('/delete/:dinas_id', dinasController.removedinas)
router.post('/update', dinasController.updateDinas)

module.exports = router 