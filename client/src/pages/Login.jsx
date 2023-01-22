import axios from 'axios'
import { atom, useAtom } from 'jotai'
import {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Notiflix from 'notiflix';

export const Login = () => {
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem("isLoggedIn")

  useEffect(() => {
    if(isLoggedIn) {
      return navigate("/")
     }
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const username = form.elements['username'].value
    const password = form.elements['password'].value
    if(!username || !password) return

    axios.post(`${import.meta.env.VITE_ENDPOINT}/users/login`, {
      username,
      password
    })
    .then(response => {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.result[0].username))
      Notiflix.Notify.success('Login Successfully')
      navigate("/")
    })
    .catch((err) => Notiflix.Notify.failure('Login Error'))
  }
  return (
    <div className="absolute inset-0 grid items-center justify-center">
      <div style={{ width: 500 }}>
        <h1 className="text-2xl mb-4 text-center">MERN CHAT APP</h1>
        <form className="flex flex-col" onSubmit={onSubmit} id="form">
          <input type="username" name="username" placeholder="username" className="p-2 rounded-lg mb-2"/>
          <input type="password" name="password" placeholder="password" className="p-2 rounded-lg mb-2" />
          <button type="submit" className="bg-green-600 hover:bg-green-700 rounded-lg py-2 mb-4">Login</button>
        </form>
        <p className="text-sm text-center">Create account <Link to="/signup" className="text-blue-400 text-underline">here</Link></p>
      </div>
    </div>
  )
}
