// MongoDB Mongoose Schemas Reference for ONLINE FOOD ORDERING SYSTEM
// To use MongoDB directly, configure MONGO_URI in your .env file

/*
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  avatar: { type: String },
  isDemo: { type: Boolean, default: false },
  addresses: [{
    label: String,
    receiverName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    isDefault: Boolean
  }],
  favorites: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  restaurantId: { type: String },
  restaurantName: { type: String },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String },
  isVeg: { type: Boolean, default: true },
  prepTime: { type: String, default: '15-20 min' },
  isAvailable: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
  isRecommended: { type: Boolean, default: false }
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String },
  deliveryFee: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    receiverName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zip: String
  },
  paymentMethod: { type: String, default: 'Demo Payment' },
  paymentStatus: { type: String, default: 'Paid (Demo)' },
  status: { type: String, default: 'placed' },
  statusStage: { type: Number, default: 1 },
  statusLabel: { type: String, default: 'Order Placed' },
  driverName: { type: String },
  driverPhone: { type: String },
  estimatedDeliveryTime: { type: String },
  history: [{
    stage: Number,
    title: String,
    time: Date,
    note: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Food: mongoose.model('Food', FoodSchema),
  Order: mongoose.model('Order', OrderSchema)
};
*/
