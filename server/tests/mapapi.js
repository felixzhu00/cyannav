// Environmental vairables for testing.

//renamed because of weird error during testing causing cases to fail. will fix bug and naming in build 5

process.env.SERVER_PORT = 8002
process.env.SERVER_ADDRESS = "localhost"
process.env.JWT_SECRET = "testing"

const app = require("../index.js")
const request = require("supertest")

/* Mapapi API Tests*/
