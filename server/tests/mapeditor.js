// Environmental vairables for testing.
process.env.SERVER_PORT = 8003
process.env.SERVER_ADDRESS = "localhost"
process.env.JWT_SECRET = "testing"

const app = require("../index.js")
const request = require("supertest")

/* MapEditor API Tests */

//renamed because of weird error during testing causing cases to fail. will fix bug and naming in build 5

// Random test to, remove later
describe("mapmetadata/:id", () => {
    it("returns 400 if no id", async () => {
        const res = await request(app).get("mapapi/mapmetadata/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 if id does not match map", async () => {
        const res = await request(app).get("mapapi/mapmetadata/:id").send({ id: 0 })
        expect(res.statusCode).toEqual(400)
    })
})
