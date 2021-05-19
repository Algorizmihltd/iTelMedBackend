module.exports = io => {
    const router = require("express").Router()
    const { LabTestResult, validateLabTestResult } = require("../models/labTestResults")

    router.get('/', async (req, res) => {
        const labTestResults = await LabTestResult.find()
        res.status(200).send(labTestResults)
    })

    router.get('/me', async (req, res) => {
        const labTestResults = await LabTestResult.find({ user: req.user._id })
        res.status(200).send(labTestResults)
    })

    router.post('/', async (req, res) => {
        const { error } = validateLabTestResult(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        const labTestResults = new LabTestResult({
            url: req.body.url,
            name: req.body.name,
            request: req.body.request
        })

        await labTestResults.save()
        io.emit("new-labTestResults", {...req.body, _id: labTestResults._id, user: req.user._id})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const labTestRequests = LabTestRequest.findByIdAndRemove(req.params.id)
        if (!labTestRequests) return res.status(404).send("Document Not Found")
        res.status(200).send("Ok")
    })

    return router
}