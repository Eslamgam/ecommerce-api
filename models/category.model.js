

const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category required'],
        unique: [true, 'Category must be unique'],
        minlength: [3, 'Too short category name'],
        maxlength: [32, 'Too long category name'],
    },
    image:{
        type: String,
        default: 'uploads/category/islam.png'
    }
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema)