const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  cart: [{
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }]
});

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    // Proceed to the next middleware
    next();
  } catch (err) {
    // Pass any error to the next middleware
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);