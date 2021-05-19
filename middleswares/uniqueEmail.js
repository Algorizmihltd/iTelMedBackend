module.exports = async (req, res, next) => {
    const { User } = require('../models/users')
    const { Doctor } = require('../models/doctors')
    const { Lab } = require('../models/labs')
    
    const user = await User.findOne({ email: req.body.email })
    if (user) return res.status(404).send("Email already registered")
    const doctor = await Doctor.findOne({ email: req.body.doctor })
    if (doctor) return res.status(404).send("Email already registered")
    const lab = await Lab.findOne({ email: req.body.email })
    if (lab) return res.status(404).send("Email already registered")
    
    next()
}