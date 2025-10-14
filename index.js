// =================================================================
// 1. IMPORTS
// =================================================================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');

// --- Models
const Plant = require('./models/plant.model');
const User = require('./models/user.model');

// --- Middleware
const auth = require('./middleware/auth');
console.log('Type of auth middleware:', typeof auth); // Add this line

const adminAuth = require('./middleware/adminAuth');
console.log('Type of adminAuth middleware:', typeof adminAuth); // Add this line
// =================================================================
// 2. INITIALIZATION
// =================================================================
const app = express();
const PORT = 3000;

// =================================================================
// 3. SERVER STARTUP FUNCTION
// =================================================================
const startServer = async () => {
  try {
    // --- DATABASE CONNECTION ---
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully!');

    // --- MIDDLEWARE CONFIGURATION ---
    app.use(cors());
    app.use(express.json());

    // --- INITIALIZE RAZORPAY ---
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // =================================================================
    // API ROUTES
    // =================================================================

    // --- ADMIN ROUTES ---
    app.get('/api/admin/users', [auth, adminAuth], async (req, res) => {
      try {
        const users = await User.find().select('-password');
        res.json(users);
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });

    app.post('/api/admin/plants', [auth, adminAuth], async (req, res) => {
      try {
        const newPlant = new Plant(req.body);
        const savedPlant = await newPlant.save();
        res.status(201).json(savedPlant);
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });

    app.delete('/api/admin/plants/:id', [auth, adminAuth], async (req, res) => {
      try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) return res.status(404).json({ msg: 'Plant not found' });
        await plant.deleteOne();
        res.json({ msg: 'Plant removed' });
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });

    // --- PLANT ROUTES ---
    app.get('/api/plants', async (req, res) => {
      try {
        const plants = await Plant.find();
        res.json(plants);
      } catch (err) {
        res.status(500).json({ message: 'Error fetching plants' });
      }
    });

    // --- USER AUTH ROUTES ---
    app.post('/api/register', async (req, res) => {
      try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });
        user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    });

    app.post('/api/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
    });

    // --- CART ROUTES ---
    app.post('/api/cart', auth, async (req, res) => {
      try {
        const { plantId, quantity } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        const cartItemIndex = user.cart.findIndex(item => item.plantId.toString() === plantId);
        if (cartItemIndex > -1) {
          user.cart[cartItemIndex].quantity += quantity;
        } else {
          user.cart.push({ plantId, quantity });
        }
        user.markModified('cart');
        await user.save();
        res.json(user.cart);
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });

    app.get('/api/cart', auth, async (req, res) => {
      try {
        const user = await User.findById(req.user.id).populate({
          path: 'cart.plantId',
          model: 'Plant'
        });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user.cart);
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });

    // --- CHECKOUT ROUTES ---
    app.post('/api/checkout/create', auth, async (req, res) => {
      try {
        const user = await User.findById(req.user.id).populate({
          path: 'cart',
          populate: { path: 'plantId', model: 'Plant' }
        });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        const totalAmount = user.cart.reduce((sum, item) => sum + item.plantId.price * item.quantity, 0);
        if (totalAmount < 1) {
          return res.status(400).json({ msg: 'Checkout failed: Total must be at least ₹1.' });
        }
        const options = { amount: totalAmount * 100, currency: 'INR' };
        const order = await razorpay.orders.create(options);
        res.json(order);
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });

    app.post('/api/checkout/verify', auth, async (req, res) => {
      try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        user.cart = [];
        await user.save();
        res.json({ msg: 'Payment successful and cart cleared' });
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });

    // --- START SERVER ---
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('!!! FAILED TO START SERVER !!!');
    console.error(error);
    process.exit(1);
  }
};

// =================================================================
// 4. CALL THE STARTUP FUNCTION
// =================================================================
startServer();