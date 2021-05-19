module.exports = io => {
    const router = require("express").Router()
    const { Prescription, validatePrescription } = require("../models/prescriptions")

    router.get('/', async (req, res) => {
        const prescription = await Prescription.find()
        res.status(200).send(prescription)
    })

    router.get('/me', async (req, res) => {
        const prescription = await Prescription.find({ user: req.user._id })
        res.status(200).send(prescription)
    })

    router.post('/', async (req, res) => {
        const { error } = validatePrescription({...req.body, doctor: req.user._id})
        if(error) return res.status(400).send(error.details[0].message)
        const prescription = new Prescription({
            prescription_name: req.body.prescription_name,
            timing: req.body.timing,
            url: req.body.url,
            user: req.body.user,
            doctor: req.user._id
        })

        await prescription.save()
        io.emit("new-prescription", {...req.body, _id: prescription._id, doctor: req.user._id})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const prescription = Prescription.findByIdAndRemove(req.params.id)
        if (!prescription) return res.status(404).send("Prescription Not Found")
        res.status(200).send("Ok")
    })

    return router
}