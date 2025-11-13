ASSIGNMENT_02 - Stock Broker

This project contains both frontend (React.js) and backend (Node.js + WebSocket) parts, organized in two folders:

ASSIGNMENT_02/
 ┣ client/   ← React.js Frontend
 ┗ server/   ← Node.js + WebSocket Backend

------------------------------------------------------------
  PROJECT OVERVIEW

- Client: Built using React.js
- Server: Built using Node.js and WebSocket (ws package)
- Purpose: Stock Broker Assisgnment

------------------------------------------------------------
PREREQUISITES

Make sure you have these installed:

- Node.js (v16 or above)
- npm (Node Package Manager)

------------------------------------------------------------
HOW TO RUN THE PROJECT

1️⃣ START THE SERVER (BACKEND)
--------------------------------
1. Open your terminal and go inside the 'server' folder:
   cd server

2. Install dependencies:
   npm install

3. Start the server:
   node index.js

4. The server will start running at:
   http://localhost:4000

------------------------------------------------------------
2️⃣ START THE CLIENT (FRONTEND)
--------------------------------
1. Open a new terminal and go inside the 'client' folder:
   cd client
   Then go inside the StockBroker Folder
   cd StockBroker

2. Install dependencies:
   npm install

3. Start the React development server:
   npm run dev

4. The React app will open automatically in your browser at:
   http://localhost:5173

------------------------------------------------------------
🔗 WEBSOCKET CONNECTION

- The client connects to the WebSocket running on port 4000.
- Messages sent by one client can be broadcast to all connected clients.

------------------------------------------------------------
📁 FOLDER STRUCTURE

ASSIGNMENT_02/
 ┣ client/         → React.js frontend
 ┃ ┣ src/
 ┃ ┣ public/
 ┃ ┗ package.json
 ┣ server/         → Node.js + WebSocket backend
 ┃ ┣ index.js
 ┃ ┗ package.json
 ┣ .gitignore
 ┗ README.txt

------------------------------------------------------------
🧾 AUTHOR

Developed by Aryan Singh
Date: November 2025
