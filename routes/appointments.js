module.exports = io => {
    const router = require("express").Router()
    const { Appointment, validateAppointment } = require("../models/appointments")

    router.get('/', async (req, res) => {
        const appointments = await Appointment.find()
        res.status(200).send(appointments)
    })

    router.get('/user/me', async (req, res) => {
        const appointments = await Appointment.find({ user: req.user._id }).sort({ date: -1 }).populate('doctor')
        appointments.forEach(app => {
            app.doctor = {
                _id: app.doctor._id,
                gender: app.doctor.gender,
                profile_image: app.doctor.profile_image,
                first_name: app.doctor.first_name,
                last_name: app.doctor.last_name
            }
        })
        res.status(200).send(appointments)
    })

    router.get('/doctor/me', async (req, res) => {
        const appointments = await Appointment.find({ doctor: req.user._id }).populate('user').sort({ date: -1 })
        appointments.forEach(app => {
            app.user = {
                _id: app.user._id,
                gender: app.user.gender,
                profile_image: app.user.profile_image,
                first_name: app.user.first_name,
                last_name: app.user.last_name
            }
        })
        res.status(200).send(appointments)
    })
    router.put('/:id', async (req, res) => {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, {
            accepted: req.body.accepted
        })
        if (!appointment) return res.status(404).send("Appointment Not Found")
        io.emit("appointment-updated", { _id: req.params.id, answers: req.body.accepted })
        res.send("Ok")
    })
    router.post('/', async (req, res) => {
        const { error } = validateAppointment({ ...req.body})
        if(error) return res.status(400).send(error.details[0].message)
        const appointment = new Appointment({
            doctor: req.body.doctor,
            user: req.body.user,
            time: req.body.time,
            slot: req.body.slot,
            accepted: false
        })

        await appointment.save()
        const app = await Appointment.findById(appointment._id).populate('user')
        io.emit("new-appointment", {
            ...req.body, user: {
                _id: app.user._id,
                profile_image: app.user.profile_image,
                gender: app.user.gender,
                first_name: app.user.first_name,
                last_name: app.user.last_name
        } , _id: appointment._id})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const appointment = Appointment.findByIdAndDelete(req.params.id)
        if (!appointment) return res.status(404).send("Appointment Not Found")
        res.status(200).send("Ok")
    })

    return router
}