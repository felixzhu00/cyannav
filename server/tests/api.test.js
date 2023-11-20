// Environmental vairables for testing.
process.env.SERVER_PORT = 8001
process.env.SERVER_ADDRESS = "localhost"
process.env.JWT_SECRET = "testing"

const app = require("../../index.js")
const request = require("supertest")

/* Map API Tests*/
