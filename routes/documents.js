module.exports = io => {
    const router = require("express").Router()
    const { Document, validateDocument } = require("../models/documents")

    router.get('/', async (req, res) => {
        const documents = await Document.find()
        res.status(200).send(documents)
    })

    router.get('/me', async (req, res) => {
        const documents = await Document.find({ uploader: req.user._id })
        res.status(200).send(documents)
    })

    router.post('/', async (req, res) => {
        const { error } = validateDocument({ ...req.body})
        if(error) return res.status(400).send(error.details[0].message)
        const document = new Document({
            uploader: req.body.uploader,
            title: req.body.title,
            name: req.body.name,
            url: req.body.url,
        })

        await document.save()
        io.emit("new-document", {...req.body, _id: document._id})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const document = Document.findByIdAndRemove(req.params.id)
        if (!document) return res.status(404).send("Document Not Found")
        res.status(200).send("Ok")
    })

    return router
}