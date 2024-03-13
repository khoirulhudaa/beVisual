const mongoose = require('mongoose')

const DinasModel = new mongoose.Schema({
    dinas_id: {
        type: String,
        required: true
    },
    dinas_name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
})

module.exports = mongoose.model('dinasVisual', DinasModel)
