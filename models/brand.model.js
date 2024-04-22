

const mongoose = require('mongoose')


const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand required'],
        unique: [true, 'Brand must be unique'],
        minlength: [3, 'Too short Brand name'],
        maxlength: [32, 'Too long Brand name'],
    },
    image: {
        type: String,
        default: 'uploads/brands/islam.png'
    }
}, { timestamps: true })

module.exports = mongoose.model('Brand', brandSchema)