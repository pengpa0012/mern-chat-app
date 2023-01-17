const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const messageSchema = new mongoose.Schema({
  text: String, 
  username: String,
  room: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  Users: mongoose.model('Users', userSchema),
  Message: mongoose.model('Message', messageSchema)
}