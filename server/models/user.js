const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },   
  verificationToken: String,
  isVerified: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false },
  paymentAmount: { type: Number },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id.toString(), role: this.role }, process.env.JWT_SECRET);
  return token;
};

module.exports = mongoose.model('User', userSchema);