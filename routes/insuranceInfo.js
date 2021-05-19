module.exports = io => {
    const router = require("express").Router()
    const { InsuranceInfo, validateInsuranceInfo } = require("../models/insuranceInfo")

    router.get('/', async (req, res) => {
        const insuranceInfos = await InsuranceInfo.find()
        res.status(200).send(insuranceInfos)
    })

    router.get('/me', async (req, res) => {
        const insuranceInfos = await InsuranceInfo.find({ user: req.user._id })
        res.status(200).send(insuranceInfos)
    })

    router.post('/', async (req, res) => {
        const { error } = validateInsuranceInfo({ ...req.body, user: req.user._id})
        if(error) return res.status(400).send(error.details[0].message)
        const insuranceInfo = new InsuranceInfo({
            health_insurance_company: req.body.health_insurance_company,
            health_insurance_id: req.body.health_insurance_id,
            timing: req.body.timing,
            user: req.user._id,
        })

        await insuranceInfo.save()
        io.emit("new-insuranceInfo", {...req.body, _id: insuranceInfo._id, user: req.user._id})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const insuranceInfo = InsuranceInfo.findByIdAndRemove(req.params.id)
        if (!insuranceInfo) return res.status(404).send("Document Not Found")
        res.status(200).send("Ok")
    })

    return router
}