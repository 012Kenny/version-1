console.log("test")
const express = require("express");
console.log("test 2")
const session = require("express-session");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("./users.db");
const fs = require("fs");


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


app.get("/", (req, res) => {
    if (req.session.userId) {
        res.sendFile(path.join(__dirname, "homepage", "../homepage/index.html"));
        } else {
      res.redirect("../AccountCreateLogin/accountlogin.html");
    }
  });



  

  // Sign up

  app.post("/signup", (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");

    stmt.run(username, hashedPassword, function (err) {
        if (err) {
          return res.send("Username already exists. <a href=',,/AccountCreateLogin/accountcreate.html'>Try again</a>");
        }

    req.session.userId = this.lastID;
    req.session.username = username;
    res.redirect("/");
  });
});

app.post("/login", (req, res) => {
    const {username, password} = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (!user) return res.send(" Invalid username or password. <a href='../AccountCreateLogin/accountlogin.html'>Try again</a>");        
        const validPass = bcrypt.compareSync(password, user.password);
        if (!validPass) return res.send("Invalid username or password. <a href='../AccountCreateLogin/accountlogin.html'>Try again</a>");
    
    req.session.userId = user.id;
    req.session.username = user.username;
    res.redirect("/");
    });
});

  

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/AccountCreateLogin/accountlogin.html");
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
