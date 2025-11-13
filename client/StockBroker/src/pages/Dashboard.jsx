import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const stockList = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const [subscribed, setSubscribed] = useState([]);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // Fetch subscriptions on load
  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:4000/subscriptions/${email}`)
        .then((res) => setSubscribed(res.data))
        .catch(console.error);
    }
  }, [email]);

  // Connect to WebSocket server
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    socket.onopen = () => console.log("✅ Connected to WebSocket");
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "prices") {
        setPrices(message.data);
      }
    };

    socket.onclose = () => console.log("❌ WebSocket disconnected");
    return () => socket.close();
  }, []);

  const toggleSubscribe = async (stock) => {
    const res = await axios.post("http://localhost:4000/toggle-subscription", {
      email,
      stock,
    });
    setSubscribed(res.data.subscribed);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {email}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stockList.map((stock) => (
          <div
            key={stock}
            className="bg-white shadow-md rounded-xl p-6 text-center"
          >
            <h2 className="text-xl font-semibold mb-2">{stock}</h2>
            <p className="text-gray-700 mb-4">
              Price: ₹{prices[stock] || "Loading..."}
            </p>
            <button
              onClick={() => toggleSubscribe(stock)}
              className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
                subscribed.includes(stock)
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {subscribed.includes(stock) ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
