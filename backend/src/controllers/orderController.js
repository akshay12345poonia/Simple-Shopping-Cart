const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, customer_email, sort = '-createdAt' } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (customer_email) {
      query.customer_email = customer_email;
    }
    
    const orders = await Order.find(query).sort(sort);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};


exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Create order (checkout)
exports.createOrder = async (req, res, next) => {
  try {
    const { items, customer_name, customer_email } = req.body;
    
    // Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product_name} not found`,
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }
    

    let total_amount = 0;
    for (const item of items) {
      total_amount += item.price * item.quantity;
    }

    const order = await Order.create({
      items,
      total_amount,
      customer_name,
      customer_email,
      status: 'confirmed',
    });
    
    
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product_id,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    
    console.log('📦 New Order Received:');
    console.log('Order ID:', order._id);
    console.log('Customer:', customer_name, '-', customer_email);
    console.log('Items:', items);
    console.log('Total:', total_amount);
    console.log('---');
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};


exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
