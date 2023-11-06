const http = require('http')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookieparser')


const hostname = '127.0.0.1'
const port = 8000

const app = express()

// MIDDLE WARE
app.use(express.urlencoded({extend: true}))
app.use(cors({
  origin: ["http://129.213.145.105"],
  credentials: true
}))
app.use(express.json())
// app.use(cookieParser())

const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)

// Initialize database connection
const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection failed'))

// Run server
app.listen(port, () => console.log(`Server running on port ${port}`))