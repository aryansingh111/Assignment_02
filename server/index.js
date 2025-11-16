import express from "express";
import cors from "cors";
import fs from "fs";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

// Using JSON Helpers Method for read and write data in json file
const readData = (file) => JSON.parse(fs.readFileSync(file, "utf-8") || "[]");
const writeData = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

// SIGNUP
app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const users = readData("users.json");

  if (users.find((u) => u.email === email)) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  users.push({ email, password });
  writeData("users.json", users);
  res.json({ success: true, message: "Signup successful" });
});

let user;

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = readData("users.json");
  user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({ success: false, message: "Email not found" });
  }

  if (user.password !== password) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid password" });
  }

  res.json({ success: true, message: "Login successful", email });
});

//SUBSCRIBE / UNSUBSCRIBE
app.post("/toggle-subscription", (req, res) => {
  const { email, stock } = req.body;
  const subs = readData("subscriptions.json");

  const userSubs = subs[email] || [];
  let updatedSubs;

  if (userSubs.includes(stock)) {
    updatedSubs = userSubs.filter((s) => s !== stock);
  } else {
    updatedSubs = [...userSubs, stock];
  }

  subs[email] = updatedSubs;
  writeData("subscriptions.json", subs);

  res.json({ success: true, subscribed: updatedSubs });
});

//  GET USER SUBSCRIPTIONS
app.get("/subscriptions/:email", (req, res) => {
  const { email } = req.params;
  const subs = readData("subscriptions.json");
  res.json(subs[email] || []);
});

const server = app.listen(4000, () =>
  console.log("Server + WebSocket running on port 4000")
);

//  WEBSOCKET SERVER
const wss = new WebSocketServer({ server });

const stockList = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

function getStockPrices() {
  const prices = {};
  stockList.forEach((s) => {
    prices[s] = (Math.random() * 1000 + 100).toFixed(2);
  });
  return prices;
}


const clients = new Map();

// Broadcast prices to specific user based on their subscriptions
setInterval(() => {
  const prices = getStockPrices();
  const subscriptions = readData("subscriptions.json");

  clients.forEach((ws, email) => {
    if (ws.readyState === 1) {
      const userStocks = subscriptions[email] || [];

      // Only send prices for stocks the user is subscribed to
      const userPrices = userStocks.map((stock) => ({
        name: stock,
        rate: prices[stock],
      }));

      const message = JSON.stringify({ type: "prices", data: userPrices });
      ws.send(message);
    }
  });
}, 1000);

wss.on("connection", (ws) => {
  console.log("New client connected");

  let userEmail = null;

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      // When client sends their email, register them
      if (data.type === "register" && data.email) {
        userEmail = data.email;
        clients.set(userEmail, ws);
        console.log(`User registered: ${userEmail}`);

        ws.send(
          JSON.stringify({
            type: "registered",
            message: `Connected to stock server as ${userEmail}`,
          })
        );
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    if (userEmail) {
      clients.delete(userEmail);
      console.log(`User disconnected: ${userEmail}`);
    }
  });

  ws.send(
    JSON.stringify({
      type: "welcome",
      message: "Connected to stock server. Please register with your email.",
    })
  );
});
