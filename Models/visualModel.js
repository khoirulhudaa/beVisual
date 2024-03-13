const mongoose = require('mongoose')

const VisualModel = new mongoose.Schema({
    visual_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type_dinas: {
        type: String,
        required: true
    },
    uploader: {
        type: String,
        required: true
    },
    link: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
})

module.exports = mongoose.model('isual', VisualModel)
