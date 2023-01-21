const express = require("express")
const bodyParser = require("body-parser")
const http = require('http')
const app = express()
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
const cors = require("cors")
const userRoutes = require("./routes/users")
const connectDB = require("./config/db")
const {Message} = require("./model")

connectDB()

// Middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())


app.use("/users", userRoutes)
io.on('connection', (socket) => {
  console.log('A user connected')
  socket.on('disconnect', () => {
      console.log('User disconnected')
  })

  socket.on('join room', (room) => {
    socket.join(room);
    io.in(room).emit('user joined', room);
  });

  socket.on("new message", (message, username, room) => {
    const payload = {text: message, username, room, createdAt: Date.now()}
    Message.insertMany([payload])
    io.in(room).emit("new message", payload)
  })

  socket.on("user typing", (message, room) => {
    io.in(room).emit("user typing", message)
  })

})


const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// TODO 
// -Typing animation
// -Room style
// -Fixed logout bug
// -Add sidebar content
// -Add logout Modal