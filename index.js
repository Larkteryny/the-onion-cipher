"use strict"; // Crashes hard

// Import functionality
const encryptor = require('./encrypt')
const decryptor = require('./decrypt')
const fs = require('fs')
const path = require('path')
var cors = require('cors');

// Create server
const express = require('express')
const http = require('http');
const port = process.env.PORT || 8080; // Arbitrary
const app = express();
const server = http.createServer(app);

// Allows browser and server to communicate
app.use(cors({
  origin: "https://theonioncipher.ethan11111.repl.co",
}))
// Handle data received
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// Always provide files in folder "public"
app.use(express.static(path.join(__dirname, 'public')))

// Client request to encrypt
app.post('/encrypt', (req, res) => {
  console.log("encrypting on serverside")
  var msg = req.body.to_encrypt
  const seq = req.body.seq
  const keys = req.body.keys
  console.log(msg, seq)
  msg = encryptor.encrypt(msg, seq, keys)
  console.log(msg)
  res.json(msg)
  console.log("sent")
})

// Client request to decrypt
app.post('/decrypt', (req, res) => {
  console.log("decrypting on serverside")
  const msg = req.body.to_decrypt
  const keys = req.body.keys
  decryptor.decrypt(msg, keys)
    .then(value => {
      const possibilities = value
      console.log(possibilities)
      res.json({ possibilities })
      console.log("sent")
  })
})

server.listen(port, function() {
  console.log("App listening on port " + port)
})