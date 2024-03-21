const express = require("express")
const app = express()
const mysql = require("mysql")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Connect to database
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
})

db.getConnection((err, connection) => {
  if (err) throw err
  console.log("Connected to database")
})

// Signup - create new user
app.post("/signup", (req, res) => {
  const user = req.body.name
  const password = req.body.password

  // Check if user already exists
  const sqlSearch = "SELECT * FROM userTable WHERE user = ?"
  db.query(sqlSearch, [user], (err, result) => {
    if (err) throw err

    if (result.length !== 0) {
      res.status(409).send("User already exists")
    } else {
      // Hash password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err

        // Insert new user
        const sqlInsert = "INSERT INTO userTable (user, password) VALUES (?, ?)"
        db.query(sqlInsert, [user, hashedPassword], (err, result) => {
          if (err) throw err

          res.status(201).send("User created")
        })
      })
    }
  })
})

// Login - authenticate user
app.post("/login", (req, res) => {
  const user = req.body.name
  const password = req.body.password

  // Check if user exists
  const sqlSearch = "SELECT * FROM userTable WHERE user = ?"
  db.query(sqlSearch, [user], (err, result) => {
    if (err) throw err

    if (result.length === 0) {
      res.status(404).send("User not found")
    } else {
      // Compare password
      bcrypt.compare(password, result[0].password, (err, result) => {
        if (err) throw err

        if (result) {
          res.status(200).send("Authenticated")
        } else {
          res.status(401).send("Invalid password")
        }
      })
    }
  })
})

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000")
})