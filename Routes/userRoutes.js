const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userModel } = require('../model/userModel');

const userRoutes = express.Router()

userRoutes.get("/", (req, res) => {
    res.send("welcome");
});


/**
 * @swagger
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: name.
 *         email:
 *           type: string
 *           description: email of user/admin.
 *         password:
 *           type: string
 *           description: password of user/admin.
 *         age:
 *           type: integer
 *           description: age of user/admin.
 *         location:
 *           type: string
 *           description: location of user/admin.
 *     RegResult:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: message
 *           example: User Registered Succesfully. 
 *     LogReq:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: message
 *           example: Albin@gmail.com.
 *         password:
 *           type: string
 *           description: message
 *           example: Albin123.
 *     LogResult:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: message
 *           example: User logged in Succesfully.
 *         token:
 *           type: string
 *           description: token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
 */

/**
 * @swagger
 * /users/register:
 *  post:
 *    summary: To post details of new user/admin.
 *    tags: [Users]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *            $ref: '#/components/schemas/NewUser' 
 *    responses:
 *     200:
 *       description: The user was successfully registered
 *       content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/LogResult'
 *     500:
 *       description: Bad Request      
 */

userRoutes.post("/register",async(req,res)=>{
    const {username,email,password,city,age} = req.body
    try {
        const emailCheck = await userModel.findOne({email})
        if(emailCheck){
            res.status(400).send({"msg": "Email already exists"})
        }else{
            bcrypt.hash(password, 5, async(err,hash)=>{
                const newUser = new userModel({
                    username,
                    email,
                    password:hash,
                    city,
                    age
                })
                await newUser.save()
                res.status(200).send({"msg":"User registered successfully"})
            })       
        }
    } catch (error) {
        res.status(400).send({"err": error.message})
    }
})

/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: To post credentials of new user/admin.
 *    tags: [Users]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *            $ref: '#/components/schemas/LogReq' 
 *    responses:
 *     200:
 *       description: user logged in successfully
 *       content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/LogResult'
 *     500:
 *       description: Bad Request      
 */

userRoutes.post("/login",async(req,res)=>{
    const {email, password} = req.body
    try {
        const user = await userModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    const token = jwt.sign({userID: user._id},process.env.key)
                    res.status(200).send({"msg": "Login successful", token: token})
                }else{
                    res.status(400).send({"err":"Wrong credentials"})
                }
            })
        }else{
            res.status(400).send({"err":"No user exists"})
        }
    } catch (error) {
        res.status(400).send({"err":error.message})
    }
})


module.exports = {userRoutes}