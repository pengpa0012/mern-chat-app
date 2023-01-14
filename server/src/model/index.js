const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const messageSchema = new mongoose.Schema({
  text: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Message: mongoose.model('Message', messageSchema)
}