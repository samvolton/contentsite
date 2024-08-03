const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number
  },
  verificationToken: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  
  user.tokens = user.tokens || [];
  user.tokens.push({ token });
  
  await user.save();
  return token;
};

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;