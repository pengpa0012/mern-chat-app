import axios from 'axios'
import { atom, useAtom } from 'jotai'
import Notiflix from 'notiflix'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Signup = () => {
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
    const repeatPassword = form.elements['repeatPassword'].value
    if(!username || !password) return
    if(password !== repeatPassword) return Notiflix.Notify.failure("Password does not matched")
    axios.post(`${import.meta.env.VITE_ENDPOINT}/users/signup`, {
      username,
      password
    })
    .then(response => {
      console.log(response)
      Notiflix.Notify.success(response.data.message)
      navigate("/login")
    })
    .catch((err) => Notiflix.Notify.failure(err.response.data.message))
  }
  return (
    <div className="absolute inset-0 grid items-center justify-center">
      <div style={{ width: 500 }}>
        <h1 className="text-2xl mb-4 text-center">Register</h1>
        <form className="flex flex-col" onSubmit={onSubmit} id="form">
          <input type="text" name="username" placeholder="username" className="p-2 rounded-lg mb-2"/>
          <input type="password" name="password" placeholder="password" className="p-2 rounded-lg mb-2" />
          <input type="password" name="repeatPassword" placeholder="repeat password" className="p-2 rounded-lg mb-2" />
          <button type="submit" className="bg-green-600 hover:bg-green-700 rounded-lg py-2 mb-4">Signup</button>
        </form>
        <p className="text-sm text-center">Already have an account? click <Link to="/login" className="text-blue-400 text-underline">here</Link></p>
      </div>
    </div>
  )
}
