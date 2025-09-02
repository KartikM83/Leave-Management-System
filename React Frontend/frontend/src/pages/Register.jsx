import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('EMPLOYEE')
  const [show, setShow] = useState(false)
  const navigate = useNavigate()   // ✅ uncommented

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(password !== confirm){
      alert('Passwords do not match')
      return
    }

    const parts = name.trim().split(' ')
    const payload = { 
      name: parts[0] || '', 
      lastName: parts.slice(1).join(' ') || '', 
      email, 
      password, 
      role 
    }

    try {
      const response = await fetch("http://localhost:8080/users/register", {  // ✅ direct fetch
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        alert("Registration failed: " + (err.errorMessage || "Unknown error"));
        return;
      }

      alert("Registration successful!");
      navigate("/")   // ✅ will redirect to login page
    } catch (err) {
      alert("Registration failed: " + err.message);
      console.error(err);
    }
  }

  return (
    <div className="bg-[#2d2d2d] h-screen flex justify-center items-center text-white">
      <div className="w-full h-full flex">
        <div className="w-1/2 h-full bg-[#454545] rounded-r-full"></div>
        <div className="w-1/2 h-full flex flex-col justify-center px-28 gap-3">
          <div className="text-2xl font-semibold">Create Account</div>
          <form id="registerForm" onSubmit={handleSubmit}>
            
            {/* Name */}
            <label>Full Name</label>
            <div className="relative w-full mb-4">
              <i className="fa fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-white"></i>
              <input type="text" placeholder="Your Name"
                className="w-full p-4 pl-10 border placeholder-white border-black rounded-xl bg-transparent text-white hover:border-white focus:border-[#ffbd20] focus:border-2 focus:outline-none"
                required value={name} onChange={e=>setName(e.target.value)} />
            </div>

            {/* Email */}
            <label>Your Email</label>
            <div className="relative w-full mb-4">
              <i className="fa fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-white"></i>
              <input type="email" placeholder="Email"
                className="w-full p-4 pl-10 border placeholder-white border-black rounded-xl bg-transparent text-white hover:border-white focus:border-[#ffbd20] focus:border-2 focus:outline-none"
                required value={email} onChange={e=>setEmail(e.target.value)} />
            </div>

            {/* Password */}
            <label>Password</label>
            <div className="relative w-full mb-4">
              <i className="fa fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white"></i>
              <input id="password" type={show ? 'text' : 'password'} placeholder="Password"
                className="w-full p-4 pl-10 pr-10 border placeholder-white border-black rounded-xl bg-transparent text-white hover:border-white focus:border-[#ffbd20] focus:border-2 focus:outline-none"
                required value={password} onChange={e=>setPassword(e.target.value)} />
              <button type="button" onClick={()=>setShow(s=>!s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                <i className={`fa ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            {/* Confirm Password */}
            <label>Confirm Password</label>
            <div className="relative w-full mb-4">
              <i className="fa fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white"></i>
              <input id="confirmPassword" type={show ? 'text' : 'password'} placeholder="Confirm Password"
                className="w-full p-4 pl-10 pr-10 border placeholder-white border-black rounded-xl bg-transparent text-white hover:border-white focus:border-[#ffbd20] focus:border-2 focus:outline-none"
                required value={confirm} onChange={e=>setConfirm(e.target.value)} />
            </div>

            {/* Role */}
            <label className="block text-white text-lg mb-2">Are You?</label>
            <div className="flex gap-8 mb-5">
              <div onClick={()=>setRole('EMPLOYEE')} className={`w-1/3 flex items-center justify-center py-3 border border-[#ffbd20] rounded-md gap-2 cursor-pointer ${role==='EMPLOYEE' ? 'bg-[#ffbd2010]' : ''}`}>
                <input type="radio" id="EMPLOYEE" name="role" value="EMPLOYEE" checked={role==='EMPLOYEE'} readOnly/>
                <label htmlFor="EMPLOYEE">EMPLOYEE</label>
              </div>
              <div onClick={()=>setRole('MANAGER')} className={`w-1/3 flex items-center justify-center py-3 border border-[#ffbd20] rounded-md gap-2 cursor-pointer ${role==='MANAGER' ? 'bg-[#ffbd2010]' : ''}`}>
                <input type="radio" id="MANAGER" name="role" value="MANAGER" checked={role==='MANAGER'} readOnly/>
                <label htmlFor="MANAGER">Manager</label>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="bg-[#ffbd20] text-black font-semibold w-full py-2 rounded-xl transition-colors duration-200">
              Sign up
            </button>
          </form>

          <div className="flex items-center justify-center text-[18px]">
            Have an account?
            <Link to="/" className="text-[#ffbd20] ml-1 hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
