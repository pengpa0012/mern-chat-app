import { useState, useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { formatDate, sortDate } from './utils';

function App() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      username: "",
      text: "",
      room: "",
      createdAt: ""
    }
  ])
  const [socketId, setSocketId] = useState(null)
  const [room, setRoom] = useState()
  const [socket] = useState(io("ws://localhost:3000"))
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  const username = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")
  const { data: allMessages, status } = useQuery('users', async () => {
    const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/users/getMessages`, {
      method: 'GET',
      headers: {
        'x-access-token': token
    }})
    return response.json()
  })

  useEffect(() => {
    if(status == "success") {
      setMessages([...allMessages.messages])
    }
  }, [status])


  useEffect(() => {
    if(!isLoggedIn) {
     return navigate("/login")
    }
  }, [isLoggedIn])

  console.log(messages)


  useEffect(() => {
    setSocketId(socket.id);
    socket.on("new message", (payload) => {
      console.log(payload)
      setMessages([...messages, payload])
    })
    // socket.on("message saved", (payload) => {
    //  console.log(payload)
    // })
  }, [messages])


  const onSendMessage = (message) => {
    if(message.key !== "Enter" || message.target.value == "") return
    socket.emit("new message", message.target.value, username, room ?? "General");
    document.querySelector(".message-input").value = ''
    
    const messageBox = document.querySelector(".message-box")
    messageBox.scrollTop =  messageBox.scrollHeight
  }
  // const onJoinRoom = (message) => {
  //   if(message.key !== "Enter") return
  //   setRoom(message.target.value)
  // }


  return (
    <div className="App">
      <div className="m-2">
        <h1>Room join: {room || "General"}</h1>
        <div className="p-3 h-80 border border-gray-500 rounded-md text-left message-box overflow-auto">
          {
             messages?.filter(message => message.username != "").map((message, i) => ( 
              <h1 key={`message-${i}`} className="bg-gray-700 p-2 mb-1 rounded-md flex justify-between items-center">
                <span>
                  {`${username == message.username ? "You" : message.username}: ${message.text}`}
                </span>
                <span className="text-xs">{formatDate(message.createdAt)}</span>
              </h1>
            ))
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
