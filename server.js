/** 
* server sided authetnication server
* for the account login/sign up logic and saving
*
* Run node account.js
*
*
*
* Passwords hashed with bcrypt to mitigate data leaks.
* Store user id + username
*/


//** ------- IMPORTS ------- **//
const express = require("express"); // http server and routing
const session = require("express-session"); // manages user session via signed cookie
const bcrypt = require("bcryptjs"); // hash password
const sqlite3 = require("sqlite3").verbose();
const path = require("path"); 
const http = require("http")
const { Server } = require('socket.io')
//** ------------------------ **//


//** ------- CONFIGURATION (easy to change) ------- **//
const PORT = 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "random128424" 
const STATIC_DIR = process.env.STATIC_DIR || path.join(__dirname);
const HOMEPAGE_PATH = process.env.HOMEPAGE_PATH || path.join(__dirname, "homepage", "index.html");
//** ------------------------ **//
const app = express(); // create express app
const db = new sqlite3.Database("./users.db"); // open/create data file user.db
const server = http.createServer(app); // wrap app in http server
const io = new Server(server); // attach socket.io

//** ------------------------ **//
// read json and form-encoded bodies into req.body
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("Community")); // serve front end files
//** ------------------------ **//

app.use(
    session({
        secret: "key19842",
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 7} // 7 days
    })
);

app.use(express.static(path.join(__dirname)));


db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// is this user logged in and whats their username
app.get("/session", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    res.json({ loggedIn: false });
  }
});


app.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("../homepage/index.html");
    res.sendFile(path.join(__dirname, "homepage", "../homepage/index.html"));
  } else {
    res.redirect("../homepage/index.html");
  }
});

  

  // Sign up

 app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log("Signup attempt:", username, password);

  if (!username || !password) {
    return res.json({success: false, message: "Missing username or password"});
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");

  stmt.run(username, hashedPassword, function (err) {
    if (err) {
      console.error("DB error:", err.message);
      return res.json({ success: false, message: "Username already taken." });
    }

    console.log("New user inserted with ID:", this.lastID);

    req.session.userId = this.lastID;
    req.session.username = username;
    res.json({ success: true });
  });
});

app.post("/login", (req, res) => {
    const {username, password} = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (!user) return res.json({success: false, message: "Invalid username or password"}); 
        const validPass = bcrypt.compareSync(password, user.password);
        if (!validPass) return res.json({success: false, message: "Invalid username or password"});

    
    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({success: true});
    });
});

  

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/AccountCreateLogin/accountlogin.html");
    });
});




//** ------- Variables - Chat ------- **//
let users = {}; // Store users: socket.id (username)
let chatHistory = []; // Store chat history: {user: "name", msg "message"}



//** ------- Chat room functionaility using socket.io ------- **//
io.on("connection", (socket) => {
  console.log("user connected")

  
  //** ------- send chat history to any new users joining the chat ------- **//
  socket.emit("chat history", chatHistory) 
  
  
  //** ------- Join chat ------- **//
  socket.on("join", (username) => { // whenever a user joins
      if (users[socket.id]) return; // already joined

      // checks if username already exists in the chat
      const nameTaken = Object.values(users).includes(username);
      if (nameTaken) {
        socket.emit("join-error", "You're already in this chatroom.");
        return;
      }


      users[socket.id] = username; // makes new user

      //// -- join message
      const joinMsg = { user: "System", msg: `${username} has joined the chat` };
      //// --

      chatHistory.push(joinMsg) // adds join msg to chat history

      io.emit("chat message", joinMsg);
  });
  //** ------------------------ **//

  
  //** ------- Message ------- **//
  socket.on("chat message", (msg) => { // whenever a user sends msg

    //// --  message
    const newMsg = {user: users[socket.id], msg};
    //// --

    //// --
    chatHistory.push(newMsg); // adds newMsg to chat history
    io.emit("chat message", newMsg);
  });
  //** ------------------------ **//


  
//** ------- Disconnect ------- **//
  socket.on("disconnect", () => { // whenever a user disconnects from chat

    if (users[socket.id]) {
      //// -- leave message
      const leaveMsg = { user: "System", msg: `${users[socket.id]} has left the chat` };
      //// --

      chatHistory.push(leaveMsg); // adds the leaveMsg to chat history
      io.emit("chat message", leaveMsg);
      delete users[socket.id]
    }

    
    //** ------- If there's no one in the chat ------- **//
    if (Object.keys(users).length === 0) { // checks user table, if none then reset
      chatHistory = []; // clear chat history
      io.emit("clear chat"); // // clear chat
    }
  });
  //** ------------------------ **//
});



server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
