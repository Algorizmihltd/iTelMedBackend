module.exports = io => {
    const router = require("express").Router()
    const { Review, validateReview } = require("../models/reviews")

    router.get('/', async (req, res) => {
        const reviews = await Review.find().populate('user')
        const response = reviews.map(rev => ({
            _id: rev._id,
            stars: rev.stars,
            doctor: rev.doctor,
            text: rev.text,
            user: {
                _id: rev.user._id,
                name: `${rev.user.first_name} ${rev.user.last_name}`,
                profile_image: rev.user.profile_image,
                gender: rev.user.gender,
            },
            date: rev.date
        }))
        res.status(200).send(response)
    })

    router.get('/doctors/:id', async (req, res) => {
        const reviews = await Review.find({ doctor: req.params.id }).sort({ date: -1 }).populate('user')
        const response = reviews.map(rev => ({
            _id: rev._id,
            stars: rev.stars,
            doctor: rev.doctor,
            text: rev.text,
            user: {
                _id: rev.user._id,
                name: `${rev.user.first_name} ${rev.user.last_name}`,
                profile_image: rev.user.profile_image,
                gender: rev.user.gender,
            },
            date: rev.date
        }))
        res.status(200).send(response)
    })

    router.put('/:id', async (req, res) => {
        const review = await Review.findByIdAndUpdate(req.params.id, {
            text: req.body.text,
            stars: req.body.stars
        })

        io.emit("update-review", { ...req.body, _id: review._id, user: req.user._id })
        res.status(200).send("Ok")
    })

    router.post('/', async (req, res) => {
        const { error } = validateReview({ ...req.body, user: req.user._id, })
        if(error) return res.status(400).send(error.details[0].message)
        const review = new Review({
            user: req.user._id,
            stars: req.body.stars,
            doctor: req.body.doctor,
            text: req.body.text
        })

        await review.save()
        io.emit("new-review", {...req.body, user: req.user._id, _id: review._id})
        res.send("Ok")
    })

    router.delete('/:id', async (req, res) => {
        const review = Review.findByIdAndRemove(req.params.id)
        if (!review) return res.status(404).send("Review Not Found")
        io.emit("review-deleted", req.params.id)
        res.status(200).send("Ok")
    })

    return router
}