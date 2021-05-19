module.exports = io => {
    const router = require("express").Router()
    const { Medication, validateMedication } = require("../models/medications")

    router.get('/', async (req, res) => {
        const medications = await Medication.find()
        res.status(200).send(medications)
    })

    router.get('/me', async (req, res) => {
        const medications = await Medication.find({ user: req.user._id })
        res.status(200).send(medications)
    })

    router.put('/:id', async (req, res) => {
        const medication = await Medication.findByIdAndUpdate(req.params.id, {
            completed: true
        })

        io.emit("update-medication", {_id: medication._id })
        res.status(200).send("Ok")
    })

    router.post('/', async (req, res) => {
        const { error } = validateMedication({ ...req.body, user: req.user._id,})
        if(error) return res.status(400).send(error.details[0].message)
        const medication = new Medication({
            user: req.body.user,
            refillTime: req.body.refillTime,
            startDate: req.body.startDate,
            dosage: req.body.dosage,
            endDate: req.body.endDate,
            name: req.body.name,
            time: req.body.time,
            completed: false
        })

        await medication.save()
        io.emit("new-medication", {...req.body, user: req.user._id, _id: medication._id})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const medication = Medication.deleteOne({_id :req.params.id})
        if (!medication) return res.status(404).send("Medication Not Found")
        res.status(200).send("Ok")
    })

    return router
}