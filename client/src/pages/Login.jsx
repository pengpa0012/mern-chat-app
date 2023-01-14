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
    const email = form.elements['email'].value
    const password = form.elements['password'].value
    if(!email || !password) return

    axios.post(`${import.meta.env.VITE_ENDPOINT}/users/login`, {
      email,
      password
    })
    .then(response => {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("token", response.data.accessToken);
      Notiflix.Notify.success('Login Successfully')
      navigate("/")
    })
    .catch((err) => Notiflix.Notify.failure('Login Error'))
  }
  return (
    <div className="absolute inset-0 grid items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg" style={{ width: 300 }}>
        <h1 className="text-2xl mb-4">Todo App</h1>
        <form className="flex flex-col" onSubmit={onSubmit} id="form">
          <input type="email" name="email" placeholder="email" className="p-2 rounded-lg mb-2"/>
          <input type="password" name="password" placeholder="password" className="p-2 rounded-lg mb-2" />
          <button type="submit" className="bg-green-500 rounded-lg py-2 mb-4">Login</button>
        </form>
        <p className="text-sm">Create account <Link to="/signup" className="text-blue-200 text-underline">here</Link></p>
      </div>
    </div>
  )
}
