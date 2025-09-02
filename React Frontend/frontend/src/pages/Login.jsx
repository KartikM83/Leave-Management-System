import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password Not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.errorMessage || "Wrong credentials");
      }

      const user = await response.json();

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);

      alert("Login successful!");

      if (user.role === "EMPLOYEE") navigate("/employee");
      else if (user.role === "MANAGER") navigate("/manager");
      else navigate("/");
    } catch (err) {
      alert("Login failed: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="bg-[#2d2d2d] h-screen flex justify-center items-center text-white">
      <div className="w-full h-full flex">
        {/* Left side */}
        <div className="w-1/2 h-full flex flex-col justify-center px-28 gap-3">
          <div className="text-2xl font-semibold">Login Account</div>
          <form id="loginForm" onSubmit={handleSubmit}>
            {/* Email */}
            <label>Your Email</label>
            <div className="relative w-full mb-4">
              <i className="fa fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"></i>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full p-4 pl-10 border placeholder-white border-black rounded-xl bg-transparent text-white hover:border-white focus:border-[#ffbd20] focus:border-2 focus:outline-none transition-colors duration-200"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <label>Password</label>
            <div className="relative w-full mb-4">
              <i className="fa fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"></i>
              <input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="w-full p-4 pl-10 pr-10 border placeholder-white border-black rounded-xl bg-transparent text-white hover:border-white focus:border-[#ffbd20] focus:border-2 focus:outline-none transition-colors duration-200"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white focus:outline-none"
              >
                <i className={`fa ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* Confirm Password */}
            <label>Confirm Password</label>
            <div className="relative w-full mb-4" id="secondpass">
              <i className="fa fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"></i>
              <input
                id="password1"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-4 pl-10 pr-10 border placeholder-white border-black rounded-xl bg-transparent text-white hover:border-white focus:border-[#ffbd20] focus:border-2 focus:outline-none transition-colors duration-200"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white focus:outline-none"
              >
                <i className={`fa ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-[#ffbd20] text-black font-semibold w-full py-2 rounded-xl transition-colors duration-200"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center text-[18px]">
            Have an account?
            <Link to="/register" className="text-[#ffbd20] ml-1 hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="w-1/2 h-full bg-[#454545] rounded-l-full"></div>
      </div>
    </div>
  );
}

export default Login;
