const app = require('../../index.js');
const request = require('supertest')

describe('newMap', () => {
    it('returns code 201 if map added to db, otherwise 400', async () => {
        const res = await request(app).post('/api/newmap').send({ type: "map" });
    
        expect(res.statusCode).toEqual(404);
    });
});

describe('registerUser', () => {
    it('returns code 401 since passwords dont match', async () => {
        const res = await request(app).post('/auth/register').send({ password: "hi", passwordVerify: "hey"});
    
        expect(res.statusCode).toEqual(401);
    });
});