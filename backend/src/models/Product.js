const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  image_url: {
    type: String,
    required: [true, 'Product image is required'],
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['electronics', 'clothing', 'home', 'beauty', 'sports'],
    required: true,
  },
  stock: {
    type: Number,
    default: 100,
    min: [0, 'Stock cannot be negative'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);