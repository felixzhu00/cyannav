// Environmental vairables for testing.
process.env.SERVER_PORT = 8002
process.env.SERVER_ADDRESS = "localhost"
process.env.JWT_SECRET = "testing"

const app = require("../index.js")
const request = require("supertest")

/* Map API Tests*/

describe("mapbyid/:id", () => {
    it("returns 400 if no id", async () => {
        const res = await request(app).get("/api/mapbyid/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 if id does not match map", async () => {
        const res = await request(app).get("/api/mapbyid/:id").send({ id: 0 })
        expect(res.statusCode).toEqual(400)
    })
})

describe("mapbyuser/:id", () => {
    it("returns code 400 if no user id", async () => {
        const res = await request(app).get("/api/mapbyuser/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 500 for now", async () => {
        const res = await request(app)
            .get("/api/mapbyuser/:id")
            .send({ userId: "cyan boy" })
        expect(res.statusCode).toEqual(500)
    })
})

describe("allMap", () => {
    it("returns code 200 for now", async () => {
        const res = await request(app).get("/api/allmap").send({})
        expect(res.statusCode).toEqual(200)
    })
})

describe("mapjson/:id", () => {
    it("returns code 400 if no id", async () => {
        const res = await request(app).get("/api/mapjson/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    // it('returns code 500 if no map matches id given', async () => {
    //     const res = await request(app).get('/api/mapjson/:id').send({id: 100298});
    //     expect(res.statusCode).toEqual(500);
    // });
    //write test for if id is associated with map
})

describe("newMap", () => {
    it("returns code 400 if no title and/or json is given", async () => {
        const res = await request(app).post("/api/newmap").send({ type: "map" })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 if no json is given", async () => {
        const res = await request(app)
            .post("/api/newmap")
            .send({ title: "US states", type: "map" })
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 if type is not heat map", async () => {
        const res = await request(app)
            .post("/api/newmap")
            .send({ title: "US states", type: "map", json: " " })
        expect(res.statusCode).toEqual(400)
    })
    // it('returns code 500 since json is empty string', async () => {
    //     const res = await request(app).post('/api/newmap').send({ title: "US states", type: "heatmap", json: " " });
    //     expect(res.statusCode).toEqual(500);
    // });
})

describe("duplicatemap", () => {
    it("returns code 400 if no id is sent", async () => {
        const res = await request(app).post("/api/duplicatemap").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 401 since sending info is bad", async () => {
        const res = await request(app)
            .post("/api/duplicatemap")
            .send({ id: 100629 })
        expect(res.statusCode).toEqual(401)
    })
    //add another tets for if there is map which matches the id sent
})

describe("forkMap", () => {
    // it('returns code 400 if no id is sent', async () => {
    //     const res = await request(app).post('/api/forkmap').send({});
    //     expect(res.statusCode).toEqual(400);
    // });
    it("returns code 404 if no map matches the id sent", async () => {
        const res = await request(app).post("/api/forkmap").send({ id: 100629 })
        expect(res.statusCode).toEqual(404)
    })
    //add another tets for if there is map which matches the id sent
})

describe("deletemap/:id", () => {
    it("returns code 400 if no id is sent", async () => {
        const res = await request(app).delete("/api/deletemap/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    // it('returns code 500 if no map matches the id sent', async () => {
    //     const res = await request(app).delete('/api/deletemap/:id').send({id: 100629});
    //     expect(res.statusCode).toEqual(500);
    // });
})

// describe('mapname', () => {
//     it('returns code 201 if map added to db, otherwise 404', async () => {
//         const res = await request(app).post('/api/mapname').send({ type: "map" });

//         expect(res.statusCode).toEqual(404);
//     });
// });

// describe('maptag', () => {
//     it('returns code 201 if map added to db, otherwise 404', async () => {
//         const res = await request(app).post('/api/maptag').send({ type: "map" });

//         expect(res.statusCode).toEqual(404);
//     });
// });

// describe('mapstatus', () => {
//     it('returns code 201 if map added to db, otherwise 404', async () => {
//         const res = await request(app).post('/api/mapstatus').send({ type: "map" });

//         expect(res.statusCode).toEqual(404);
//     });
// });

// describe('mapjson', () => {
//     it('returns code 201 if map added to db, otherwise 404', async () => {
//         const res = await request(app).post('/api/mapjson').send({ type: "map" });

//         expect(res.statusCode).toEqual(404);
//     });
// });
