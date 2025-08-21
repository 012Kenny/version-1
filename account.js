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

db.run(

);


app.get("/", (req, res) => {
    if (req.session.userId) {
      res.send(`<h1>Welcome back, ${req.session.username}!</h1>
                <a href="/logout">Logout</a>`);
    } else {
      res.redirect("/AccountCreateLogin/accountlogin.html");
    }
  });



  

  // Sign up

  app.post("/signup", (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");

    stmt.run(username, hashedPassword, function (err) {
        if (err) {
          return res.send("❌ Username already exists. <a href='/AccountCreateLogin/accountcreate.html'>Try again</a>");
        }

    req.session.userId = this.lastID;
    req.session.username = username;
    res.redirect("/");
  });
});
  

