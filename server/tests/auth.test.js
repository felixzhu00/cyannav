// Environmental vairables for testing.\

//renamed because of weird error during testing causing cases to fail. will fix bug and naming in build 5
process.env.SERVER_PORT = 8001
process.env.SERVER_ADDRESS = "localhost"
process.env.JWT_SECRET = "testing"

const app = require("../index.js")
const request = require("supertest")

/* Auth API Tests */

describe("updateProfilePic", () => {
    it("returns 401 since user is unauthorized", async () => {
        const res = await request(app).post("/auth/updateProfilePic").send({})
        expect(res.statusCode).toEqual(401)
        expect(JSON.parse(res.text).errorMessage).toEqual("Unauthorized")
    })
})

describe("loggedIn", () => {
    it("returns 401 since user is not logged in", async () => {
        const res = await request(app).get("/auth/loggedIn").send({})
        expect(res.statusCode).toEqual(401)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
    })
})

describe("login", () => {
    it("returns 400 if no password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: "hi@hello.com" })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
    it("returns 400 if no email", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ password: "password" })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
    it("returns 400 if no email nor password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({})
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
})

describe("logout", () => {
    it("shoudl always return 200", async () => {
        const res = await request(app).post("/auth/logout").send({})
        expect(res.statusCode).toEqual(200)
    })
})

describe("register", () => {
    it("returns 400 if no password", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "hi@hello.com" })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
    it("returns 400 if no email", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ password: "password" })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
    it("returns 400 if no email nor password", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({})
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    })
    it("returns 401 if password does not match passwordVerify", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "hi", username: "hello", password: "hi", passwordVerify: "hello" })
        expect(res.statusCode).toEqual(401)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Passwords do not match")
    })
    it("returns 401 if password is not long enough", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "hi", username: "hello", password: "hi$$", passwordVerify: "hi$$" })
        expect(res.statusCode).toEqual(401)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Password fails security requirement.")
    })
    it("returns 401 if password does not contain 2 special characters", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "hi", username: "hello", password: "1234567890", passwordVerify: "1234567890" })
        expect(res.statusCode).toEqual(401)
        expect(JSON.parse(res.text).loggedIn).toEqual(false)
        expect(JSON.parse(res.text).errorMessage).toEqual("Password fails security requirement.")
    })
})

describe('reset', () => {
    it('returns 400 if no email', async () => {
        const res = await request(app).post('/auth/reset').send({});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
})

describe('verifyCode', () => {
    it('returns 400 if no params passed', async () => {
        const res = await request(app).post('/auth/verifyCode').send({});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
    it('returns 400 if no email', async () => {
        const res = await request(app).post('/auth/verifyCode').send({passcode: 111111});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
    it('returns 400 if no code', async () => {
        const res = await request(app).post('/auth/verifyCode').send({email: "test@hi.com"});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
});

describe('updatePasscodeNotLoggedInCode', () => {
    it('returns 400 if no params passed', async () => {
        const res = await request(app).post('/auth/updatePasscodeNotLoggedIn').send({});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
    it('returns 400 if no email', async () => {
        const res = await request(app).post('/auth/updatePasscodeNotLoggedIn').send({password: "password"});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
    it('returns 400 if no code', async () => {
        const res = await request(app).post('/auth/updatePasscodeNotLoggedIn').send({email: "test@hi.com"});
        expect(res.statusCode).toEqual(400);
        expect(JSON.parse(res.text).errorMessage).toEqual("Required fields empty.")
    });
    it('returns 401 if passwords do not match', async () => {
        const res = await request(app).post('/auth/updatePasscodeNotLoggedIn').send({
            email: "test@hi.com",
            password: "hi",
            confirmPassword: "hello"
        });
        expect(res.statusCode).toEqual(401);
        expect(JSON.parse(res.text).errorMessage).toEqual("Passwords do not match")
    });
});

describe('updatePass', () => {
    it('returns 400 if no params passed', async () => {
        const res = await request(app).post('/auth/updatePass').send({});
        expect(res.statusCode).toEqual(400);
    });
    it('returns 400 if no original password and no verification code', async () => {
        const res = await request(app).post('/auth/updatePass').send({
            password: "newpass",
            passwordVerify: "diffpass",
        });
        expect(res.statusCode).toEqual(400);
    });
    it('returns 400 if original password and verification code', async () => {
        const res = await request(app).post('/auth/updatePass').send({
            originalPassword: "password",
            password: "newpass",
            passwordVerify: "diffpass",
            verificationCode: 111111
        });
        expect(res.statusCode).toEqual(400);
    });
    it('returns 401 if passwords do not match', async () => {
        const res = await request(app).post('/auth/updatePass').send({
            originalPassword: "password",
            password: "newpass",
            passwordVerify: "diffpass",
        });
        expect(res.statusCode).toEqual(401);
        expect(JSON.parse(res.text).errorMessage).toEqual("Passwords do not match.")
    });
});

describe("updateUsername", () => {
    it("returns 400 if no username", async () => {
        const res = await request(app).post("/auth/updateUsername").send({})
        expect(res.statusCode).toEqual(400)
    })
})

describe("updateEmail", () => {
    it("returns 400 if no email", async () => {
        const res = await request(app).post("/auth/updateEmail").send({})
        expect(res.statusCode).toEqual(400)
    })
})

describe("deleteAccount", () => {
    it("returns 400 if no params passed", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 if no email or password", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({username: "hi"})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 if no email", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({username: "hi", password: "pass"})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 400 if no username", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({email: "hi", password: "pass"})
        expect(res.statusCode).toEqual(400)
    })
    it("returns 401 since user is not logged in", async () => {
        const res = await request(app).post("/auth/deleteAccount").send({
            username: "user",
            email: "hi",
            password: "pass"
        })
        expect(res.statusCode).toEqual(401)
    })
})
