const mongoose = require('mongoose')

const adminSchema=mongoose.Schema({
    name: String,
    title: String,
    strike_price: Number,
    size: String,
    brand: String,
    discount: String,
    category: String,
    images: Array,
    userID:String
},{
    versionKey: false
})

const adminModel = mongoose.model('admin',adminSchema)

module.exports ={
    adminModel
}

