import { useState, useEffect } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:3000";

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const payload = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${API}/users/login`,
        payload,
        { withCredentials: true }
      );
      console.log('Login success: ', response.data)
      // console.log("Login success:", response.data.token);
  
      alert("Login successful!");

      // Clear inputs
      setEmail("");
      setPassword("");

      // localStorage.setItem('token', response.data.token)

    } catch (err) {
      console.error("Login error:", err);

    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {

    try {
      // const authToken = localStorage.getItem('token')
      const response = await axios.get(`${API}/api/users`, {
        withCredentials: true
      });
      console.log("userData:", response.data);
    } catch (err) {
      console.log("getUsers error:", err);
    }

  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Login to your account
        </p>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            onClick={() => { getUsers() }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <span className="text-blue-600 cursor-pointer">
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;