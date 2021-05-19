const app = require('../index')
const {Doctor} = require('../models/doctors')
const mongoose = require('mongoose')
const supertest = require('supertest')
const data = {
    first_name: "Ismail",
    profile_image: "ismail.png",
    phone_number: "09022314973",
    last_name: "Dalhatu",
    password: "123",
    address: "address",
    email: "email@gmail.com",
    bio: "Bio",
    services: ["Psyco"],
        location:{
            latitude: 0,
            longitude: 0
        }
    }

beforeEach(done => {
    mongoose.connect("mongodb://localhost/itelmed-test", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true}, () => done())
})

afterEach(done => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done())
    })
})

test('GET /doctors ', async () => {
    const user = await Doctor.create(data)

    await supertest(app).get("/doctors")
        .expect(200)
        .then(res => {
            expect(Array.isArray(res.body)).toBeTruthy()
            expect(res.body.length).toEqual(1)

            expect(res.body[0].location.longitude).toBe(user.location.longitude)
            expect(res.body[0].location.latitude).toBe(user.location.latitude)
            expect(res.body[0].profile_image).toBe(user.profile_image)
            expect(res.body[0].phone_number).toBe(user.phone_number)
            // expect(res.body[0].dateOfBirth).toBe(user.dateOfBirth)
            expect(res.body[0].first_name).toBe(user.first_name)
            expect(res.body[0].last_name).toBe(user.last_name)
            expect(res.body[0].address).toBe(user.address)
            // expect(res.body[0].password).toBe(user.password)
            expect(res.body[0].email).toBe(user.email)
            expect(res.body[0].services[0]).toBe(user.services[0])
            expect(res.body[0].bio).toBe(user.bio)
        })
})

test('POST /doctors', async () => {
    await supertest(app).post('/doctors')
        .send(data)
        .expect(201)
})