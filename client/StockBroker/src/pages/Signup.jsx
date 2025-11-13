import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try
    {
      const res = await axios.post("http://localhost:4000/signup", {
        email,
        password,
      });

      if (res.data.success) {
        setSuccess("Signup successful! Redirecting to login...");
        setError("");
        setTimeout(() => navigate("/login"), 1500);
      }
    } 
    
    catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Signup
        </h2>

        <input 
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSignup}
          className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
        >
          Signup
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {success && (
          <p className="text-green-500 text-center mt-4">{success}</p>
        )}

        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account?</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;