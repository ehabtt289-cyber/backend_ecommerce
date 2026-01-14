const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()

const app = express();
app.use(cors());
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






app.listen(PORT, () => console.log(`Server running on port ${PORT}`))