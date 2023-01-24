import { useState, useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { formatDate, sortDate } from './utils';
import Notiflix from 'notiflix'
import { Modal } from './components/Modal';

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
  const [showModal, setShowModal] = useState(false)
  const [roomID, setRoomID] = useState("General")
  // const [userTyping, setUserTyping] = useState()
  const [socket] = useState(io(import.meta.env.VITE_ENDPOINT))
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  const username = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")
  const sampleRoom = ["General", "Room 1", "Room 2", "Room 3", "Room 4"]
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

  const onJoinRoom = (room) => {
    refetch()
    socket.emit("join room", room)
    setRoomID(room)
  }
  const onLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate("/")
    Notiflix.Notify.success('Logout Successfully')
  }

  return (
    <div className="App min-h-full flex">
      <Modal onCancel={() => setShowModal(false)} message="Are you sure you want to logout?" show={showModal} onOk={() => onLogout()}/>
      <div className="p-2 h-screen min-w-[250px] w-1/6 bg-gray-800">
        <div className="p-2 h-full flex flex-col justify-between">
          <div className="flex justify-between items-center my-4">
            <h1 className="text-xl text-center">{username}</h1>
            <h2 className="text-sm">Room: {roomID}</h2>
          </div>
          <ul className="my-12 text-center">
            {
              sampleRoom.map((room, i) => (
                <li className={`${roomID == room ? "bg-gray-700" : "text-gray-500"} hover:bg-gray-700 rounded-md py-2 mb-2 cursor-pointer`} key={`room-${i}`} onClick={() => onJoinRoom(room)}>{room}</li>
              ))
            }
          </ul>
          <button className="bg-red-600 hover:bg-red-700 p-2 px-4 rounded-md" onClick={() => setShowModal(true)}>Logout</button>
        </div>
      </div>
      <div className="p-2 h-screen w-full">
        <div className="my-4 px-3 py-6 border min-h-[80%] max-h-[600px] border-gray-500 rounded-md text-left message-box overflow-auto">
          {
             messages?.flat()?.filter(message => message?.username != "").filter(room => room?.room == roomID).map((message, i) => ( 
              <h1 title={formatDate(message?.createdAt)} key={`message-${i}`} className={`p-3 mb-1 flex justify-between items-center w-fit max-w-sm mb-6 ${username == message?.username ? "rounded-r-xl rounded-t-xl bg-green-600" : "ml-auto rounded-l-xl rounded-t-xl bg-gray-700"} relative`}>
                <span className="text-gray-400 absolute -top-6 left-2" style={{ fontSize: 11 }}>{username == message?.username ? "You" : message?.username}</span>
                <span className="break-all">
                  {message?.text}
                </span>
              </h1>
            ))
          }
        </div>
        <div className="min-h-[10%]">
          <div className="mt-4 flex">
            <input type="text" placeholder="Send message..." className="p-2 rounded-md w-full focus:outline-none message-input" onKeyDown={(e) => {
              // socket.emit("user typing", `${username} is typing...`, roomID)
              // socket.on("user typing", (message) => {
              //   if(message.split(" ")[0] == username) return
              //   console.log("here")
              // })
              onSendMessage(e)
            }} />
            {/* <button className="ml-2 bg-blue-500 bg- px-6 rounded-md">Send</button> */}
          </div>
          {/* <div className="flex mt-2">
            <input type="text" placeholder="Join room..." className="p-2 rounded-md w-full focus:outline-none room-input" onKeyDown={(e) => onJoinRoom(e)} />
          </div> */}
        </div>
      </div>
    </div>
  )

}

export default App
