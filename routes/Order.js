const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const {auth, isAdmin} = require('../midelware/auth')
const Product = require('../models/Product')
const User = require('../models/User')
router.post('/addOrder', auth, async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Products are required' });
    }

    

    let total = 0;

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      total += product.price * item.quantity;
    }

    const newOrder = new Order({
      user: req.user._id,
      products,
      total
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/myOreders', auth,async (req, res) =>{
  try{
    const orders = await Order.find({user: req.user._id}).populate('products.product')
    res.status(200).json(orders)
  }catch(err){
    res.status(500).json({message: err.message})
  }
})


router.get('/allOrders', auth,isAdmin, async (req, res) =>{
  try{
    const orders = await Order.find().populate('products.product').populate('user')  
    res.status(200).json(orders)
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

 module.exports = router