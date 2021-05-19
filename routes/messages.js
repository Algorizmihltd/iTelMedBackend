const { Doctor } = require('../models/doctors')
const { User } = require('../models/users')

module.exports = io => {
    const router = require('express').Router()
    const { Message, validateMessage } = require('../models/messages')
    router.get('/', async (req, res) => {
        const messages = await Message.find()
        const filterd = messages.filter(m => m.reciever.toString() === req.user._id.toString())
        const payload = []
        for (let i = 0; i < filterd.length; i++) {
            const mssg = filterd[i];
            const opt = {
                _id: mssg._id,
                content: mssg.content,
                file: mssg.file,
                reciever: mssg.reciever,
                date: mssg.date,
                user: {}
            }
            if (mssg.senderType === 'User') {
                const u = await User.findById(mssg.user)
                opt.user = {
                    _id: u._id,
                    first_name: u.first_name,
                    last_name: u.last_name,
                    gender: u.gender,
                    profile_image: u.profile_image
                }
            } else if (mssg.senderType === 'Doctor') {
                const u = await Doctor.findById(mssg.user)
                opt.user = {
                    _id: u._id,
                    first_name: u.first_name,
                    last_name: u.last_name,
                    gender: u.gender,
                    profile_image: u.profile_image
                }
            }
            if (!payload.find(it => it.user._id.toString() === opt.user._id.toString())) {
                payload.push(opt)
            } else {
                payload.forEach(it => {
                    if (it => it.user._id.toString() === opt.user._id.toString()) {
                        it.content = opt.content,
                        it.date = opt.date,
                        it.file = opt.file
                    }
                });
            }
        }
        res.send(payload)
    })

    router.post('/:id', async (req, res) => {
        const { error } = validateMessage({ ...req.body, reciever: req.params.id, user: req.user._id, senderType: 'Yellow' })
        if (error) return res.status(400).send(error.details[0].message)
        const message = new Message({
            user: req.user._id,
            reciever: req.params.id,
            content: req.body.content,
            file: req.body.file,
            senderType: req.user.isDoctor ? 'Doctor' : req.user.isLab ? 'Lab' : req.user.isPharm ? 'Pharm' : 'User'
        })
        await message.save()
        const payload = await Message.findById(message._id)
        io.emit('chat message', payload)
        res.send('Ok')
    })

    router.get('/:id', async (req, res) => {
        const messages = await Message.find()
        const payload = []
        for (let i = 0; i < messages.length; i++) {
            const messg = messages[i];
            if (((messg.user.toString() === req.user._id.toString()) && (messg.reciever.toString() === req.params.id.toString())) || ((messg.user.toString() === req.params.id.toString()) && (messg.reciever.toString() === req.user._id.toString()))) {
                payload.push(messg)
            }
        }
        res.send(payload).toString()
    })
    return router
}