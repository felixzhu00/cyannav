// Environmental vairables for testing.

//all tests temporarily moved to this file. will move them back in build 5
process.env.SERVER_PORT = 8002
process.env.SERVER_ADDRESS = "localhost"
process.env.JWT_SECRET = "testing"

const app = require("../index.js")
const request = require("supertest")

/* Map API Tests*/

describe("mapmetadata/:id", () => {
    it("returns 400 if no id", async () => {
        const res = await request(app).get("/api/mapmetadata/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 if id does not match map", async () => {
        const res = await request(app).get("/api/mapmetadata/:id").send({ id: 0 })
        expect(res.statusCode).toEqual(400)
    })
})

describe("mapbyuser/:id", () => {
    it("returns code 400 if no user id", async () => {
        const res = await request(app).get("/api/mapbyuser/:id").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns code 400 given a userId", async () => {
        const res = await request(app).get("/api/mapbyuser/:id").send({ userId: "cyan boy" })
        expect(res.statusCode).toEqual(400)
    })
})

describe("allpublishedmap", () => {
    it("should return code 200", async () => {
        const res = await request(app).get("/api/allpublishedmap").send({})
        expect(res.statusCode).toEqual(200)
    })
})

describe("mapgeojson/:id", () => {
    it("returns code 400 if no id", async () => {
        const res = await request(app).get("/api/mapgeojson/:id").send({})
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
    it("returns code 400 for now", async () => {
        const res = await request(app).post("/api/duplicatemap").send({ id: "1006298" })
        expect(res.statusCode).toEqual(400)
    })
    //add another tets for if there is map which matches the id sent
})

describe("forkMap", () => {
    it('returns code 400 if no id is sent', async () => {
        const res = await request(app).post('/api/forkmap').send({});
        expect(res.statusCode).toEqual(400);
    });
    it("returns code 401 if no map matches the id sent", async () => {
        const res = await request(app).post("/api/forkmap").send({ id: 10062909 })
        expect(res.statusCode).toEqual(401)
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

describe("loggedIn", () => {
    it("returns 401 if user id not in db", async () => {
        const res = await request(app).get("/auth/loggedIn").send({})
        expect(res.statusCode).toEqual(401)
    })
})

describe("login", () => {
    it("returns 400 if no password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: "hi@hello.com" })
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 if no email", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ password: "password" })
        expect(res.statusCode).toEqual(400)
    })
    // it('returns 401 if no user associated with email and password', async () => {
    //     const res = await request(app).post('/auth/login').send({email: "hi@hello.com", password: "password"});
    //     expect(res.statusCode).toEqual(401);
    // });
})

describe("logout", () => {
    it("shoudl always return 200", async () => {
        const res = await request(app).post("/auth/logout").send({})
        expect(res.statusCode).toEqual(200)
    })
})

describe("register", () => {
    it("returns 401 if password does not match passwordVerify", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ password: "hi", passwordVerify: "hello" })
        expect(res.statusCode).toEqual(401)
    })
    it("returns 401 if password is not long enough", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ password: "hi", passwordVerify: "hi" })
        expect(res.statusCode).toEqual(401)
    })
    // it('returns ??? ', async () => {
    //     const res = await request(app).post('/auth/register').send({
    //         username: "john",
    //         email: "hello@hi.com",
    //         password: "password123$$$",
    //         passwordVerify: "password123$$$"
    //     });
    //     expect(res.statusCode).toEqual(500);
    // });
})

// describe('reset', () => {
//     it('returns 400 if no id', async () => {
//         const res = await request(app).get('/auth/reset').send({});
//         expect(res.statusCode).toEqual(400);
//     });
//     it('returns 404 if id does not match map', async () => {
//         const res = await request(app).get('/auth/reset').send({id: 0});
//         expect(res.statusCode).toEqual(404);
//     });
// });

// describe('verifyCode', () => {
//     it('returns 400 if no id', async () => {
//         const res = await request(app).get('/auth/verifyCode').send({});
//         expect(res.statusCode).toEqual(400);
//     });
//     it('returns 404 if id does not match map', async () => {
//         const res = await request(app).get('/auth/verifyCode').send({id: 0});
//         expect(res.statusCode).toEqual(404);
//     });
// });

describe("updateUsername", () => {
    it("returns 400 if no username", async () => {
        const res = await request(app).post("/auth/updateUsername").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 for now since no usernames in db", async () => {
        const res = await request(app)
            .post("/auth/updateUsername")
            .send({ username: "hi" })
        expect(res.statusCode).toEqual(400)
    })
})

describe("updateEmail", () => {
    it("returns 400 if no email", async () => {
        const res = await request(app).post("/auth/updateEmail").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 for now since no emails in db", async () => {
        const res = await request(app)
            .post("/auth/updateUsername")
            .send({ username: "hi" })
        expect(res.statusCode).toEqual(400)
    })
})

describe("deleteAccount", () => {
    it("returns 401 for now since no users exist yet", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({})
        expect(res.statusCode).toEqual(401)
    })
})

// describe('updatePass', () => {
//     it('returns 400 if no id', async () => {
//         const res = await request(app).get('/auth/updatePass').send({});
//         expect(res.statusCode).toEqual(400);
//     });
//     it('returns 404 if id does not match map', async () => {
//         const res = await request(app).get('/auth/updatePass').send({id: 0});
//         expect(res.statusCode).toEqual(404);
//     });
// });

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
