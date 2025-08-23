const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("./users.db");


app.use(express.urlencoded({ extended: true}));
app.use(express.json());

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

app.listen(3000, () => console.log(`Server running at http://localhost:${3000}`));






