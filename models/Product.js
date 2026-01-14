const  mongoose =   require('mongoose')
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: String},
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    stock: {type: Number, required: true},
    discount: {type: Number, default: 0}
    
})
module.exports = mongoose.model('Product', productSchema)