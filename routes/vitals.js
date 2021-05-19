module.exports = io => {
    const router = require("express").Router()
    const { Vitals, validateVitals } = require("../models/vitals")

    router.get('/', async (req, res) => {
        const vitals = await Vitals.find()
        res.status(200).send(vitals)
    })

    router.get('/me', async (req, res) => {
        const vitals = await Vitals.find({ user: req.user._id })
        res.status(200).send(vitals)
    })

    router.put('/:id', async (req, res) => {
        const vitals = await Vitals.findByIdAndUpdate(req.params.id, {
            blood_pressure_diastolic: req.body.blood_pressure_diastolic,
            blood_pressure_systolic: req.body.blood_pressure_systolic,
            bio_blood_temprature: req.body.bio_blood_temprature,
            blood_glucose: req.body.blood_glucose,
            heart_rate: req.body.heart_rate,
            height: req.body.height,
            mass: req.body.mass,
        })

        io.emit("update-vitals", { ...req.body, _id: vitals._id, user: req.user._id })
        res.status(200).send("Ok")
    })

    router.post('/', async (req, res) => {
        const { error } = validateVitals({ ...req.body, user: req.user._id,})
        if(error) return res.status(400).send(error.details[0].message)
        const vitals = new Vitals({
            blood_pressure_diastolic: req.body.blood_pressure_diastolic,
            blood_pressure_systolic: req.body.blood_pressure_systolic,
            bio_blood_temprature: req.body.bio_blood_temprature,
            blood_glucose: req.body.blood_glucose,
            heart_rate: req.body.heart_rate,
            height: req.body.height,
            mass: req.body.mass,
            user: req.user._id
        })

        await vitals.save()
        io.emit("new-vitals", {...req.body, user: req.user._id, _id: vitals._id})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const vitals = Vitals.findByIdAndRemove(req.params.id)
        if (!vitals) return res.status(404).send("Vitals Not Found")
        res.status(200).send("Ok")
    })

    return router
}