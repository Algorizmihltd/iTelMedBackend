const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const { User } = require('../models/users')
const { Doctor } = require('../models/doctors')
const { Lab } = require('../models/labs')

router.post('/', async (req, res) => {
    const user = await User.findOne({ "email": req.body.email })
    const doctor = await Doctor.findOne({ "email": req.body.email })
    const lab = await Lab.findOne({ "email": req.body.email })
    if(!user && !doctor && !lab) res.status(404).send("Invalid email or password")
    if (user) {
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if(!validPassword) return res.status(404).send("Invalid email or password")
        const token = jwt.sign({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            _id: user._id,
        },process.env.JWTKEY)
        res.send(token)
    }
    if (doctor) {
        const validPassword = await bcrypt.compare(req.body.password,doctor.password)
        if(!validPassword) return res.status(404).send("Invalid email or password")
        const token = jwt.sign({
            first_name: doctor.first_name,
            last_name: doctor.last_name,
            email: doctor.email,
            _id: doctor._id,
            isDoctor: true
        },process.env.JWTKEY)
        res.send(token)
    }
    if (lab) {
        const validPassword = await bcrypt.compare(req.body.password,lab.password)
        if(!validPassword) return res.status(404).send("Invalid email or password")
        const token = jwt.sign({
            name: lab.name,
            email: lab.email,
            _id: lab._id,
            isLab: true
        },process.env.JWTKEY)
        res.send(token)
    }
})

module.exports = router