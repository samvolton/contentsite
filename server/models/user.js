const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  tokens: [{ token: { type: String, required: true } }]
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    console.log('Hashing password...');
    user.password = await bcrypt.hash(user.password, 8);
    console.log('Password hashed successfully');
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;