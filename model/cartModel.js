const mongoose = require('mongoose')

const cartSchema=mongoose.Schema({
    name: String,
    title: String,
    strike_price: Number,
    size: String,
    brand: String,
    discount: String,
    category: String,
    image: Array,
    userID: String

},{
    versionKey: false
})

const cartModel = mongoose.model('cart',cartSchema)

module.exports ={
    cartModel
}

