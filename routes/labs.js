const uniqueEmail = require("../middleswares/uniqueEmail")

module.exports = (io) => {
    const jwt = require("jsonwebtoken")
    const { Lab, validateLab } = require("../models/labs")
    const router = require("express").Router()
    const bcrypt = require("bcrypt")
    require('dotenv').config()

    router.get('/', async (req, res) => {
        const labs = await Lab.find().select('-password')
        res.status(200).send(labs)
    })

    router.get('/me', async (req, res) => {
        const me = await Lab.findById( req.user._id ).select("-password")
        if (!me) return res.status(404).send("Account Not Found")
        res.status(200).send(me)
    })

    router.put('/update-password', async (req, res) => {
        const lab = await Lab.findById(req.user._id)
        if(!lab) res.status(404).send("Invalid email or password")
        const validPassword = await bcrypt.compare(req.body.password,lab.password)
        if (!validPassword) return res.status(404).send("Invalid email or password")
        
        const salt = await bcrypt.genSalt(10)
        const hassPassword = await bcrypt.hash(req.body.newPassword,salt)

        await Lab.findByIdAndUpdate(req.lab._id, {
        password: hassPassword
        })
        res.send("OK")
    })

    router.put('/me', [ uniqueEmail ] , async (req, res) => {
        req.body['password'] = "password"
        const { error } = validateLab(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        const me = await Lab.findByIdAndUpdate(req.user._id, {
            phone_number: req.body.phone_number,
            profile_image: req.body.profile_image,
            country: req.body.country,
            address: req.body.address,
            state: req.body.state,
            email: req.body.email,
            name: req.body.name,
            location: req.body.location,
        })
        if (!me) return res.status(404).send("Account Not Found")
        io.emit("lab-update", {...req.body, _id: req.user._id})
        res.status(200).send("Ok")
    })

    router.post('/', [ uniqueEmail ] ,async (req, res) => {
        const isRegistered = await Lab.findOne({ email: req.body.email })
        if (isRegistered) return res.status(404).send("Email already registred")
        const { error } = validateLab(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        const lab = new Lab({
            phone_number: req.body.phone_number,
            profile_image: req.body.profile_image,
            password: req.body.password,
            country: req.body.country,
            address: req.body.address,
            state: req.body.state,
            email: req.body.email,
            name: req.body.name,
            location: req.body.location,
        })

        const salt = await bcrypt.genSalt(10)
        const hassPassword = await bcrypt.hash(lab.password, salt)
        lab.password = hassPassword
        await lab.save()
        const token = jwt.sign({
            _id: lab._id,
            name: lab.name,
            email: lab.email,
            isLab: true
        }, process.env.JWTKEY)
        io.emit("new-lab", {...req.body,_id: lab._id, password: ""})
        res.status(201).send(token)
    })

    return router
}