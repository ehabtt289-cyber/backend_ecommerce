const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()

const app = express();
app.use(cors({
  origin: 'https://80784a5a-a8bd-4ce6-b6bf-10b1ef1b7660-00-2hinyil98mpsx.pike.replit.dev', 
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




app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
