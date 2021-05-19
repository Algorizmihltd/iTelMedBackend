const uniqueEmail = require("../middleswares/uniqueEmail")

module.exports = (io) => {
    const jwt = require("jsonwebtoken")
    const { Doctor, validateDoctor } = require("../models/doctors")
    const router = require("express").Router()
    const bcrypt = require("bcrypt")
    require('dotenv').config()

    router.get('/', async (req, res) => {
        const doctors = await Doctor.find().select('-password')
        res.status(200).send(doctors)
    })

    router.get('/me', async (req, res) => {
        const me = await Doctor.findById( req.user._id ).select("-password")
        if (!me) return res.status(404).send("Account Not Found")
        res.status(200).send(me)
    })

    router.put('/update-password', async (req, res) => {
        const doctor = await Doctor.findById(req.user._id)
        if(!doctor) res.status(404).send("Invalid email or password")
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if (!validPassword) return res.status(404).send("Invalid email or password")
        
        const salt = await bcrypt.genSalt(10)
        const hassPassword = await bcrypt.hash(req.body.newPassword,salt)

        await Doctor.findByIdAndUpdate(req.user._id, {
        password: hassPassword
        })
        res.send("OK")
    })

    router.put('/me', [uniqueEmail] , async (req, res) => {
        req.body['password'] = "password"
        const { error } = validateDoctor(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        const me = await Doctor.findByIdAndUpdate(req.user._id, {
            profile_image: req.body.profile_image,
            phone_number: req.body.phone_number,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            location: req.body.location,
            services: req.body.services,
            address: req.body.address,
            country: req.body.country,
            gender: req.body.gender,
            email: req.body.email,
            state: req.body.state,
            bio: req.body.bio,
        })
        if (!me) return res.status(404).send("Account Not Found")
        io.emit("doctor-update", {...req.body, _id: req.user._id})
        res.status(200).send("Ok")
    })

    router.post('/', [uniqueEmail ] , async (req, res) => {
        const isRegistered = await Doctor.findOne({ email: req.body.email })
        if (isRegistered) return res.status(404).send("Email already registred")
        const { error } = validateDoctor(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        const doctor = new Doctor({
            profile_image: req.body.profile_image,
            phone_number: req.body.phone_number,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            location: req.body.location,
            services: req.body.services,
            password: req.body.password,
            address: req.body.address,
            country: req.body.country,
            email: req.body.email,
            gender: req.body.gender,
            state: req.body.state,
            bio: req.body.bio,
        })

        const salt = await bcrypt.genSalt(10)
        const hassPassword = await bcrypt.hash(doctor.password, salt)
        doctor.password = hassPassword
        await doctor.save()
        const token = jwt.sign({
            _id: doctor._id,
            first_name: doctor.first_name,
            last_name: doctor.last_name,
            email: doctor.email,
            isDoctor: true
        }, process.env.JWTKEY)
        io.emit("new-doctor", {...req.body,_id: doctor._id, password: ""})
        res.status(201).send(token)
    })

    return router
}