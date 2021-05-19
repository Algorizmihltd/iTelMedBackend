const router = require('express').Router()
const { PushToken, validatePushToken } = require('../models/pushTokens')
router.post('/', async (req, res) => {
    const { error } = validatePushToken({...req.body, user: req.user._id})
    if(error) return res.status(400).send(error.details[0].message)
    let token = await PushToken.findOneAndUpdate({ user: req.user._id }, {
        token: req.body.token
        })

    if (!token) {
        token = new PushToken({
            user: req.user._id,
            type: req.body.type,
            token: req.body.token,
        })
        await token.save()
    }

    res.send('Ok')
})
module.exports  = router
    
