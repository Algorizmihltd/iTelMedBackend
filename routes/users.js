const auth = require("../middleswares/auth")
const uniqueEmail = require("../middleswares/uniqueEmail")

module.exports = (io) => {
    const jwt = require("jsonwebtoken")
    const { User, validateUser } = require("../models/users")
    const router = require("express").Router()
    const bcrypt = require("bcrypt")
    require('dotenv').config()

    router.get('/', async (req, res) => {
        const users = await User.find().select('-password')
        res.status(200).send(users)
    })

    router.get('/me', auth, async (req, res) => {
        const me = await User.findById( req.user._id ).select("-password")
        if (!me) return res.status(404).send("Account Not Found")
        res.status(200).send(me)
    })

    router.post('/login', async (req, res) => {
        const user = await User.findOne({ "email": req.body.email })
        if(!user) res.status(404).send("Invalid email or password")
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if(!validPassword) return res.status(404).send("Invalid email or password")
        const token = jwt.sign({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            _id: user._id,
        },process.env.JWTKEY)
        res.send(token)
    })

    router.put('/update-password', async (req, res) => {
        const user = await User.findById(req.user._id)
        if(!user) res.status(404).send("Invalid email or password")
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if (!validPassword) return res.status(404).send("Invalid email or password")
        
        const salt = await bcrypt.genSalt(10)
        const hassPassword = await bcrypt.hash(req.body.newPassword,salt)

        await User.findByIdAndUpdate(req.user._id, {
        password: hassPassword
        })
        res.send("OK")
    })

    router.put('/me', [ uniqueEmail ] ,async (req, res) => {
        req.body['password'] = "password"
        const { error } = validateUser(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        const me = await User.findByIdAndUpdate(req.user._id, {
            emergency_contact: req.body.emergency_contact,
            profile_image: req.body.profile_image,
            phone_number: req.body.phone_number,
            dateOfBirth: req.body.dateOfBirth,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address2: req.body.address1,
            address1: req.body.address2,
            location: req.body.location,
            country: req.body.country,
            gender: req.body.gender,
            email: req.body.email,
            city: req.body.city,
        })
        if (!me) return res.status(404).send("Account Not Found")
        io.emit("user-update", {...req.body, _id: req.user._id})
        res.status(200).send("Ok")
    })

    router.post('/', [ uniqueEmail ] , async (req, res) => {
        const isRegistered = await User.findOne({ email: req.body.email })
        if (isRegistered) return res.status(404).send("Email already registred")
        const { error } = validateUser(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        const user = new User({
            emergency_contact: req.body.emergency_contact,
            profile_image: req.body.profile_image,
            phone_number: req.body.phone_number,
            dateOfBirth: req.body.dateOfBirth,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address2: req.body.address1,
            address1: req.body.address2,
            password: req.body.password,
            location: req.body.location,
            country: req.body.country,
            gender: req.body.gender,
            email: req.body.email,
            city: req.body.city,
        })

        const salt = await bcrypt.genSalt(10)
        const hassPassword = await bcrypt.hash(user.password, salt)
        user.password = hassPassword
        await user.save()
        const token = jwt.sign({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        }, process.env.JWTKEY)
        io.emit("new-user", {...req.body,_id: user._id, password: ""})
        res.status(201).send(token)
    })

    return router
}