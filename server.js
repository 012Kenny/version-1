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
const PORT = process.env.PORT || 3000;
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

// store chat history in a table
let chatHistory = [];
let activeUsers = new Set();


// ---- user joining chat room
io.on("connection", (socket) => {
  let username = null;

  socket.on("join", (name) => {
    username = name || "Guest"
    activeUsers.add(username);
    
    io.emit("system", `${username} has joined the chat.`);
    socket.emit("history", chatHistory);
  })
});


socket.on("message", (msg) => {
  if (!username) return;
  const messageObj = {username, text:msg};
  chatHistory.push(messageObj);
  io.emit('message', messageObj);
});

socket.on("leave", () => {
  if (username) {
    activeUsers.delete(username)
    io.emit("system", `${username} has left the chat.`)
  }
})


socket.on("disconnect", () => {
  if (username) {
    activeUsers.delete(username);
    io.emit("system", `${username},`)
  }
})





server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
