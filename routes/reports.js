module.exports = io => {
    var express = require('express');
    var router = express.Router();
    const {Report} = require('../models/reports');


    router.get('/me', async (req,res) => {
    const reports = await Report.find({user: req.user._id,}).sort({time:-1})
        if(!reports) return res.status(404).send("Account not found")
        res.send(reports)
    })


    router.post('/', async (req,res,) => {
        let report = new Report({
                user: req.user._id,
                issues: req.body.issues,
                selected: req.body.selected,
                mentioned: req.body.menstioned,
                specialisation: req.body.specialisation
            })
            await report.save()
            io.emit("new-repoort",{...req.body, _id: report._id})
            res.send("Ok")
    })

    return router

}