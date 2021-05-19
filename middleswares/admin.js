const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = (req, res, next) => {
    if(!req.header('x-auth-token')) return  res.status(401).send("Access denied no token provided")
    try {
        const user = jwt.verify(req.header('x-auth-token'),process.env.ADMINKEY)
        req.admin = user
        next()
    } catch (error) {
        res.status(400).send("Invalid token")
    }
}