const  jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = async (req, res, next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded.id})
       
        if(!user){
            throw new Error()
        }
        req.user = user
        next()
    }catch(err){
        res.status(401).json({message: 'Please authenticate'})
    }
}

const isAdmin = (req, res, next) => {
  // إذا الدور ليس ADMIN نرجع 403
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only' })
  }

  // إذا الدور ADMIN نستمر
  next()
}


module.exports = { auth, isAdmin }
