const http = require('http')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookieparser')


const hostname = '127.0.0.1'
const port = 3000

const app = express()

// MIDDLE WARE
app.use(express.urlencoded({extend: true}))
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}))
app.use(express.json())
// app.use(cookieParser())

const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)


// Run server
app.listen(port, () => console.log(`Server running on port ${port}`))