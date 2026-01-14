const  express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {auth, isAdmin} = require('../midelware/auth')

router.post('/register', async (req, res) =>{
  try{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
      return res.status(400).json({message: 'Please enter all fields'})
    }
    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.status(400).json({message: 'User already exists'})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({name, email, password: hashedPassword})
    
    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1w'})
    await newUser.save()
    res.status(201).json({message: 'User created successfully', user: newUser, token})
  }
  catch(err){
    res.status(500).json({message: err.message})
  }
})

router.post('/login', async (req, res) =>{
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).json({message: 'Please enter all fields'})
    }
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message: 'User does not exist'})
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
      return res.status(400).json({message: 'Invalid credentials'})
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1w'})
    res.status(200).json({message: 'User logged in successfully', user, token})
  }
  catch(err){
    res.status(500).json({message: err.message})
  }
})

router.get('/allUsers', auth,isAdmin, async (req, res) =>{
    try{
      const users = await User.find()
      res.status(200).json(users)
    }
    catch(err){
      res.status(500).json({message: err.message})
    }
})

router.put('/:id', auth,isAdmin, async (req, res) =>{
  try{
    const {name, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.findByIdAndUpdate(req.params.id, {name, email, password: hashedPassword}, {new: true})
    if(!user){
      return res.status(404).json({message: 'User not found'})
    }
    res.status(200).json({message: 'User updated successfully', user})
  }catch(err){
     res.status(500).json({message: err.message})
  }
})

router.delete('/:id', auth,isAdmin, async (req, res) =>{
  try{
    const user = await User.findByIdAndDelete(req.params.id)
    if(!user){
      return res.status(404).json({message: 'User not found'})
    }
    res.status(200).json({message: 'User deleted successfully'})
  }catch(err){
     res.status(500).json({message: err.message})
  }
})

 module.exports = router
