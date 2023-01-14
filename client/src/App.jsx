import { useState, useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";

function App() {
  const [messages, setMessages] = useState([
    {
      message: "",
      self: "",
      id: "",
    }
  ])
  const [room, setRoom] = useState()
  const socket = io("ws://localhost:3000")

  useEffect(() => {
    socket.on("message", (arg) => {
      console.log("ARR",arg)
    })
    socket.on("new message", (payload) => {
      setMessages([...messages, {message: payload.message, self: payload.id == socket.id ? true : false, id: payload.id}])
    })
  }, [messages])

  const onSendMessage = (message) => {
    if(message.key !== "Enter" || message.target.value == "") return
    socket.emit("new message", message.target.value);
    document.querySelector(".message-input").value = ''
    
    const messageBox = document.querySelector(".message-box")
    messageBox.scrollTop =  messageBox.scrollHeight
  }

  const onJoinRoom = (message) => {
    if(message.key !== "Enter") return
    setRoom(message.target.value)
  }

  return (
    <div className="App">
      <div className="m-2">
        <h1>Room join: {room || "General"}</h1>
        <div className="p-3 h-80 border border-gray-500 rounded-md text-left message-box overflow-auto">
          {
            messages.length > 1 ? messages.filter(message => message.id != "").map((message, i) => ( 
              <h1 key={`message-${i}`} className="bg-gray-700 p-2 mb-1 rounded-md">{`${message.self ? "You" : message.id}: ${message.message}`}</h1>
            )) : undefined
          }
        </div>
        <div className="mt-4">
          <input type="text" placeholder="Send message..." className="p-2 rounded-md w-full focus:outline-none message-input" onKeyDown={(e) => onSendMessage(e)} />
        </div>
        <div className="flex mt-2">
          <input type="text" placeholder="Join room..." className="p-2 rounded-md w-full focus:outline-none room-input" onKeyDown={(e) => onJoinRoom(e)} />
        </div>
      </div>
    </div>
  )

}

export default App
