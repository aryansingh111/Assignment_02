import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const stockList = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const [subscribed, setSubscribed] = useState([]);
  const [prices, setPrices] = useState({});
  const [socket, setSocket] = useState(null);

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
    if (!email) return;

    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      ws.send(JSON.stringify({ type: "register", email }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "registered") {
        console.log(message.message);
      }

      if (message.type === "prices") {
        const newPrices = {};
        message.data.forEach((stock) => {
          newPrices[stock.name] = stock.rate;
        });
        setPrices((prev) => ({ ...prev, ...newPrices }));
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");

    setSocket(ws);

    return () => ws.close();
  }, [email]);

  const toggleSubscribe = async (stock) => {
    const res = await axios.post("http://localhost:4000/toggle-subscription", {
      email,
      stock,
    });
    setSubscribed(res.data.subscribed);

    // If unsubscribing, remove the price from state
    if (!res.data.subscribed.includes(stock)) {
      setPrices((prev) => {
        const updated = { ...prev };
        delete updated[stock];
        return updated;
      });
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.close();
    }
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
        {stockList.map((stock) => {
          const isSubscribed = subscribed.includes(stock);
          const price = prices[stock];

          return (
            <div
              key={stock}
              className={`shadow-md rounded-xl p-6 text-center transition-all duration-300 ${
                isSubscribed
                  ? "bg-white border-2 border-green-500"
                  : "bg-gray-50"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">{stock}</h2>

              <p className="text-gray-700 mb-4">
                Price: ₹{isSubscribed ? price || "Loading..." : "---"}
              </p>

              {isSubscribed && price && (
                <p className="text-xs text-green-600 mb-2">🔄 Live updating</p>
              )}

              <button
                onClick={() => toggleSubscribe(stock)}
                className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
                  isSubscribed
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
