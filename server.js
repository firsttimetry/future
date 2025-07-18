const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "122006",
  database: "learn1",
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

//makes the frontend codes display on website
app.use(express.static("public")); // for serving static HTML, CSS, JS

//for sql connection testing
db.connect((err) => {
  if (err) {
    console.error("error in mysql connection:", err.message);
  } else {
    console.log("connected to  mysql database");
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

  db.query(sql, [name, email, password], (err, results) => {
    if (err) {
      console.error("error inserting users: ", err.message);
      res.send("signup failed");
    } else {
      console.log("user registered:", results.insertid);
      res.send("signup sucessfull");
    }
  });
});

//for login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("database error:", err.message);
      res.send("login failed");
    } else if (results.length === 0) {
      res.send("user not found");
    } else {
      const user = results[0];
      if (user.password === password) {
        // res.send(`welcome back, ${user.name}`);
        res.redirect("/public/homepage.html");
      } else {
        res.send("incorrect password");
      }
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
