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


// Middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

io.on('connection', (socket) => {
  console.log('A user connected')
  socket.on('disconnect', () => {
      console.log('User disconnected')
  })

  socket.on("new message", (message) => {
    const payload = {message, id: socket.id}
    io.emit("new message", payload)
    console.log(message)
  })
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})