const app = require('../../index.js');
const request = require('supertest')

describe('loggedIn', () => {
    it('returns 401 if user id not in db', async () => {
        const res = await request(app).get('/auth/loggedIn').send({});
        expect(res.statusCode).toEqual(401);
    });
});

describe('login', () => {
    it('returns 400 if no password', async () => {
        const res = await request(app).post('/auth/login').send({email: "hi@hello.com"});
        expect(res.statusCode).toEqual(400);
    });
    it('returns 400 if no email', async () => {
        const res = await request(app).post('/auth/login').send({password: "password"});
        expect(res.statusCode).toEqual(400);
    });
    // it('returns 401 if no user associated with email and password', async () => {
    //     const res = await request(app).post('/auth/login').send({email: "hi@hello.com", password: "password"});
    //     expect(res.statusCode).toEqual(401);
    // });
});

describe('logout', () => {
    it('shoudl always return 200', async () => {
        const res = await request(app).post('/auth/logout').send({});
        expect(res.statusCode).toEqual(200);
    });
});

describe('register', () => {
    it('returns 401 if password does not match passwordVerify', async () => {
        const res = await request(app).post('/auth/register').send({password: "hi", passwordVerify: "hello"});
        expect(res.statusCode).toEqual(401);
    });
    it('returns 401 if password is not long enough', async () => {
        const res = await request(app).post('/auth/register').send({password: "hi", passwordVerify: "hi"});
        expect(res.statusCode).toEqual(401);
    });
    // it('returns ??? ', async () => {
    //     const res = await request(app).post('/auth/register').send({
    //         username: "john",
    //         email: "hello@hi.com",
    //         password: "password123$$$",
    //         passwordVerify: "password123$$$"
    //     });
    //     expect(res.statusCode).toEqual(500);
    // });
});

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

describe('updateUsername', () => {
    it('returns 400 if no username', async () => {
        const res = await request(app).post('/auth/updateUsername').send({});
        expect(res.statusCode).toEqual(400);
    });
    it('returns 400 for now since no usernames in db', async () => {
        const res = await request(app).post('/auth/updateUsername').send({username: "hi"});
        expect(res.statusCode).toEqual(400);
    });
});

describe('updateEmail', () => {
    it('returns 400 if no email', async () => {
        const res = await request(app).post('/auth/updateEmail').send({});
        expect(res.statusCode).toEqual(400);
    });
    it('returns 400 for now since no emails in db', async () => {
        const res = await request(app).post('/auth/updateUsername').send({username: "hi"});
        expect(res.statusCode).toEqual(400);
    });
});

describe('deleteAccount', () => {
    it('returns 401 for now since no users exist yet', async () => {
        const res = await request(app).post('/auth/deleteAccount').send({});
        expect(res.statusCode).toEqual(401);
    });
});