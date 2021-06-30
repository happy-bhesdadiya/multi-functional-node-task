const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: {
      type: String,
      required: true
  },
  product_price: {
      type: Number,
      required: true,
  },
  product_stock: {
      type: Number,
      required: true
  },
  product_img: {
      type: String,
      required: true
  },
  is_available: {
      type: Boolean,
      required: true
  }
},
{ timestamps: true })

const Product = mongoose.model('Product', productSchema);

module.exports = Product