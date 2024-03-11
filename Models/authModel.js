const mongoose = require('mongoose')

const authVisualModel = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
})

module.exports = mongoose.model('authVisual', authVisualModel)
