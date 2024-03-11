const express = require('express')
const router = express.Router()
const visualController = require('../Controllers/visualController')
const multer = require('multer')
const upload = multer()

router.get('/', visualController.getAllVisual)
router.post('/', upload.single('image'), visualController.createVisual)
router.post('/delete/:visual_id', visualController.removeVisual)
router.post('/update', upload.single('image'), visualController.updateVisual)

module.exports = router