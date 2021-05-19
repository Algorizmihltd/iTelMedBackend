const router = require('express').Router()
const { Notification } = require('../models/notifications')
const { PushToken } = require('../models/pushTokens')
const expo = require('./expo')

router.get('/me', async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({ date: -1 })
    res.send(notifications)
})

router.put('/clear', async (req, res) => {
    await Notification.updateMany({ user: req.user._id }, {
        isSeen: true
    })
    res.send('Ok')
})

router.post('/notify-all/:type', async (req, res) => {
    const tokens = await PushToken.find({ type: req.params.type })
    const tokensList = []
    for (let i = 0; i < tokens.length; i++) {
        tokensList.push(tokens[i].token)
    }
    tokens.forEach(async token => {
        let ref = new Notification({
            user: token.user,
            content: req.body.content,
            title: req.body.title,
            target: req.body.target
        })
        await ref.save()
    })
    expo(req.body.title, req.body.content, tokensList)

    res.send('Ok')
})

router.post('/notify/:id', async (req, res) => {
    const tokens = await PushToken.find({ user: req.params.id })
    const tokensList = [tokens[0].token]
    
    tokens.forEach(async token => {
        let ref = new Notification({
            user: token.user,
            content: req.body.content,
            title: req.body.title,
            target: req.body.target
        })
        await ref.save()
    })
    expo(req.body.title, req.body.content, tokensList)

    res.send('Ok')
})

router.delete('/me', async (req, res) => {
    await Notification.deleteMany({ user: req.user._id })
    res.send('Ok')
})
module.exports = router