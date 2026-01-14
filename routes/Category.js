const  express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const {auth, isAdmin} = require('../midelware/auth')
const Product = require('../models/Product')
const multer = require('multer')      


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


router.post('/addCategory', auth, isAdmin,upload.single("image"), async (req, res) =>{
  try{
    const {name,description} = req.body;
    const image = req.file ? req.file.filename : null;
    if(!name || !description || !image){
      return res.status(400).json({message: 'Please enter all fields'})
    }
    const newCategory = new Category({name,description,image})
    await newCategory.save()
    res.status(201).json({message: 'Category created successfully', category: newCategory})
  }
  catch(err){
     res.status(500).json({message: err.message})  
  }
})

router.get('/', async (req, res) =>{
  try{
    const categories = await Category.find()
    res.status(200).json(categories)
  }catch(err){
     res.status(500).json({message: err.message})
  }
})

router.get('/:id', async (req, res) =>{
  try{
    const category = await Category.findById(req.params.id)
    if(!category){
      return res.status(404).json({message: 'Category not found'})
    }
    res.status(200).json(category)
  }catch(err){
     res.status(500).json({message: err.message})
  }
})

router.put('/:id', auth, isAdmin, async (req, res) =>{
  try{
    const {name,description} = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, {name,description}, {new: true})
    if(!category){
      return res.status(404).json({message: 'Category not found'})
    }
    res.status(200).json({message: 'Category updated successfully', category})
  }catch(err){
     res.status(500).json({message: err.message})
  }
})

router.delete('/:id', auth, isAdmin, async (req, res) =>{
  try{
    const category = await Category.findByIdAndDelete(req.params.id)
    if(!category){
      return res.status(404).json({message: 'Category not found'})
    }
    res.status(200).json({message: 'Category deleted successfully'})
  }catch(err){
     res.status(500).json({message: err.message})
  }
})

 module.exports = router