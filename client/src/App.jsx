import { useState, useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { formatDate, sortDate } from './utils';
import Notiflix from 'notiflix'

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
  const [socketId, setSocketId] = useState()
  const [roomID, setRoomID] = useState("General")
  const [socket] = useState(io("ws://localhost:3000"))
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  const username = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")
  const { data: allMessages, status, refetch } = useQuery('users', async () => {
    const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/users/getMessages`, {
      method: 'GET',
      headers: {
        'x-access-token': token
    }})
    return response.json()
  })

  useEffect(() => {
    if(status == "success") {
      setMessages([allMessages?.messages])
    }
  }, [status])


  useEffect(() => {
    if(!isLoggedIn) {
     return navigate("/login")
    }
  }, [isLoggedIn])


  useEffect(() => {
    setSocketId(socket.id)
    socket.emit("join room", "General")
    socket.on("new message", (payload) => {
      console.log(payload)
      setMessages([...messages, payload])
    })
    // socket.on("message saved", (payload) => {
    //  console.log(payload)
    // })

    socket.on('user joined', (room) => {
      console.log(`User joined room ${room}`);
    });
  }, [messages])


  const onSendMessage = (message) => {
    if(message.key !== "Enter" || message.target.value == "") return
    socket.emit("new message", message.target.value, username, roomID ?? "General");
    document.querySelector(".message-input").value = ''
    
    const messageBox = document.querySelector(".message-box")
    messageBox.scrollTop =  messageBox.scrollHeight
  }

  const onJoinRoom = (message) => {
    if(message.key !== "Enter") return
    refetch()
    socket.emit("join room", message.target.value)
    setRoomID(message.target.value)
  }

  const onLogout = () => {
    if(!confirm("Are you sure you want to logout?")) return
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate("/")
    Notiflix.Notify.success('Logout Successfully')
  }

  return (
    <div className="App">
      <div className="m-2">
        <div className="flex justify-between items-center my-4">
          <h1>Room join: {roomID ?? "General"}</h1>
          <button className="bg-green-500 hover:bg-green-600 p-2 px-4 rounded-md" onClick={() => onLogout()}>Logout</button>
        </div>
        <div className="px-3 py-6 h-80 border border-gray-500 rounded-md text-left message-box overflow-auto">
          {
             messages?.flat()?.filter(message => message?.username != "").filter(room => room.room == roomID).map((message, i) => ( 
              <h1 key={`message-${i}`} className={`bg-gray-700 p-3 mb-1 rounded-md flex justify-between items-center w-1/2 mb-6 ${username == message?.username ? "" : "ml-auto"} relative`}>
                <span>
                  {`${username == message?.username ? "You" : message?.username}: ${message?.text}`}
                </span>
                <span className="text-gray-400 absolute -bottom-6 right-0" style={{ fontSize: 11 }}>{formatDate(message?.createdAt)}</span>
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
