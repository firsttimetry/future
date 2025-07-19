const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const session = require("express-session");

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

//makes the frontend codes in public directory display on website
app.use(express.static("public")); // for serving static HTML, CSS, JS

//for session ie. for making sure u cannot acess homwpage without login
app.use(
  session({
    secret: "myscretkey",
    resave: false,
    saveUninitialized: true,
  })
);

//for sql connection testing
db.connect((err) => {
  if (err) {
    console.error("error in mysql connection:", err.message);
  } else {
    console.log("connected to  mysql database");
  }
});

//for making the .html in url go away
app.use(express.static(path.join(__dirname, "public")));

app.get("/homepage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homepage.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
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
      res.redirect("/login");
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
      // req.session.user = results[0];

      const user = results[0];

      if (user.password === password) {
        //cannot have send and redirect at the same time
        // res.send(`welcome back, ${user.name}`);
        res.redirect("/homepage");
      } else {
        res.send("incorrect password");
      }
    }
  });
});

// app.get("/homepage", (req, res) => {
//   if (req.session.user) {
//     res.sendFile(path.join(__dirname, "public", "homepage.html"));
//   } else {
//     res.redirect("/");
//   }
// });

// app.get('/logout',(req,res)=>{
//   req.session.destroy(err=>{
//     if(err) throw err;
//     res.redirect("/")
//   })
// })

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
