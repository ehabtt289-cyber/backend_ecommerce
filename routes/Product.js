const express = require('express')
const multer = require('multer')
const  Product = require('../models/Product')
const router = express.Router()
const {auth, isAdmin} = require('../midelware/auth')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  },
});

const upload = multer({ storage });


router.post('/addProduct', auth, isAdmin,upload.single("image"), async (req, res) =>{
  try{
    const {name, price, description,stock,category,discount} = req.body;
    const image = req.file ? req.file.filename : null;
    if(!name || !price || !description || !stock || !category || !image){
      return res.status(400).json({message: 'Please enter all fields'})
    }
    
    const newProduct = new Product({name, price, description,stock,category,discount ,image})
    await newProduct.save()
    res.status(201).json({message: 'Product created successfully', product: newProduct})
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

router.get('/', async (req, res) =>{
  try{
    const products = await Product.find().populate('category')
    res.status(200).json(products)
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

router.get('/category/:id', async (req, res) =>{
  try{
    const products = await Product.find({category: req.params.id}).populate('category')
    res.status(200).json(products)
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

router.get('/:id', async (req, res) =>{
  try{
    const product = await Product.findById(req.params.id).populate('category')
    if(!product){
      return res.status(404).json({message: 'Product not found'})
    }
    res.status(200).json(product)
  }catch(err){
     res.status(500).json({message: err.message})
  }
})

router.put('/:id', auth, isAdmin, async (req, res) =>{
  try{
    const {name, price, description,stock,category,discount} = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, {name, price, description,stock,category,discount}, {new: true})
    if(!product){
      return res.status(404).json({message: 'Product not found'})
    }
    res.status(200).json({message: 'Product updated successfully', product})
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

router.delete('/:id', auth, isAdmin, async (req, res) =>{
  try{
    const product = await Product.findByIdAndDelete(req.params.id)
    if(!product){
      return res.status(404).json({message: 'Product not found'})
    }
    res.status(200).json({message: 'Product deleted successfully'})
  }catch(err){
    res.status(500).json({message: err.message})
  }
})




 module.exports = router