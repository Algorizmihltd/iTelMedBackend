const jwt = require("jsonwebtoken")
require("dotenv").config()
const allowedMethods = ["POST"]
const allowedUrls = ["/users", "/login", "/doctors", "/labs"]

module.exports = (req, res, next) => {
    if ((allowedUrls.includes(req.url) && allowedMethods.includes(req.method))) return next()
    if (!req.header('x-auth-token')) return res.status(401).send("Access denied no token provided")
    try {
        const user = jwt.verify(req.header('x-auth-token'),process.env.JWTKEY)
        req.user = user
        next()
    } catch (error) {
        res.status(400).send("Invalid token")
    }
}