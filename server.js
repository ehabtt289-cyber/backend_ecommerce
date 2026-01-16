const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()

const app = express();
app.use(cors({
  origin: 'https://bbd39aac-2438-40c8-8586-9144fe174994-00-2r8spootuhn2e.sisko.replit.dev', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
));
app.use(express.json());
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db')
connectDB()

const userRoutes = require('./routes/User')
app.use('/api/users', userRoutes)
const productRoutes = require('./routes/Product')
app.use('/api/products', productRoutes)
const categoryRoutes = require('./routes/Category')
app.use('/api/categories', categoryRoutes)
const orderRoutes = require('./routes/Order')
app.use('/api/orders', orderRoutes)
app.use("/uploads", express.static("uploads"));



app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log('Hello World!')
})

// send requset to the srever in 5 minutes
app.get('/api/health', (req , res)=>{
   console.log(`Se`)
    res.status(200).send('ok')
})





app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
