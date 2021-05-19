const app = require('../index')
const {User} = require('../models/users')
const mongoose = require('mongoose')
const supertest = require('supertest')
const data = {
        emergency_contact: "09022314973",
        email: "ismaildalhatu442@gmail.com",
        profile_image: "ismail.png",
        phone_number: "09022314973",
        first_name: "Ismail",
        dateOfBirth: "1618763784307",
        last_name: "Dalhatu",
        address1: "Address 1",
        password: "123",
        address2: "address2",
        country: "Nigeria",
        gender: "Male",
        city: "Gombe",
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

test('GET /users ', async () => {
    const user = await User.create(data)

    await supertest(app).get("/users")
        .expect(200)
        .then(res => {
            expect(Array.isArray(res.body)).toBeTruthy()
            expect(res.body.length).toEqual(1)

            expect(res.body[0].location.longitude).toBe(user.location.longitude)
            expect(res.body[0].emergency_contact).toBe(user.emergency_contact)
            expect(res.body[0].location.latitude).toBe(user.location.latitude)
            expect(res.body[0].profile_image).toBe(user.profile_image)
            expect(res.body[0].phone_number).toBe(user.phone_number)
            // expect(res.body[0].dateOfBirth).toBe(user.dateOfBirth)
            expect(res.body[0].first_name).toBe(user.first_name)
            expect(res.body[0].last_name).toBe(user.last_name)
            expect(res.body[0].address1).toBe(user.address1)
            // expect(res.body[0].password).toBe(user.password)
            expect(res.body[0].address2).toBe(user.address2)
            expect(res.body[0].country).toBe(user.country)
            expect(res.body[0].gender).toBe(user.gender)
            expect(res.body[0].email).toBe(user.email)
            expect(res.body[0].city).toBe(user.city)
            
        })
})

test('POST /users', async () => {
    await supertest(app).post('/users')
        .send(data)
        .expect(201)
})