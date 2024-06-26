import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../style/login.css"
import { useAuth } from "../utils/authContext"
import React from "react"

export default function Login() {
  const { setIsLoggedIn, setAuthUser } = useAuth()
  const navigate = useNavigate()
  const [i, setI] = useState({
    email: "",
    password: "",
  }) //user info object

  const setUI = (key, value) => setI({ ...i, [key]: value }) //setUI sets UserInfo value and update i value.

  function setStateFromForm(event) {
    let element = event.target
    setUI(element.name, element.value)
    console.log(i)
  }

  async function submit(event) {
    event.preventDefault()

    let serverResponse = await fetch(
      "https://evanescent-beautiful-venus.glitch.me/auth/login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        mode: "cors",
        body: JSON.stringify(i),
      }
    )

    console.log(serverResponse)
    if (!serverResponse.ok) {
      throw new Error(`HTTP error! status: ${serverResponse.status}`)
    }

    let response = await fetch(
      "https://evanescent-beautiful-venus.glitch.me/api/user/data",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        mode: "cors",
        cookies: localStorage.getItem("SmartHouseToken"),
      }
    )
    const user = await response.json()
    console.log("user", user)

    const { email, role, homeId } = user
    if (user) {
      setAuthUser(user)
      setIsLoggedIn(true)
    }
    if (role === "OWNER" || role === "TENANT") {
      navigate("/default")
    } else if (role === "EXTERNAL") {
      navigate("/external")
    }
  }
  return (
    <div className='hid'>
      <form onSubmit={submit}>
        <img src='/SEA-logo.png' alt='Logo of the app'></img>
        <h2>Welcome</h2>
        <input
          type='email'
          required
          placeholder='email'
          maxLength='50'
          name='email'
          value={i.email}
          onChange={setStateFromForm}
        />
        <input
          type='password'
          required
          placeholder='Password (min 6 letters)'
          minLength='6'
          name='password'
          maxLength='50'
          value={i.password}
          onChange={setStateFromForm}
        />
        <button type='submit'>LOGIN</button>
      </form>
      <div className='wrong-input'>
        {/*   <p>
      Forgot <span>Email / Password </span>?
    </p>  */}
        <p>
          Contact customer care at <span>eazylivinghq@gmail.com</span>
        </p>
      </div>
    </div>
  )
}
