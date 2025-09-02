import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Manager from './pages/Manager'
import Register from './pages/Register'
import Employee from './pages/Employee'
import { Navigate, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
 <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/employee" element={<Employee/>} />
      <Route path="/manager" element={<Manager/>} />
      <Route path="*" element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default App
