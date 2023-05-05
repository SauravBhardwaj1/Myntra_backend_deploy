const mongoose = require('mongoose')

const userSchema=mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number,
    city: String,
},{
    versionKey: false
})

const userModel = mongoose.model('user',userSchema)

module.exports ={
    userModel
}