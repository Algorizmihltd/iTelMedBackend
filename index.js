require("dotenv").config()
const createError = require("http-errors")
const http = require("http")
const express = require("express")
const socketIo = require("socket.io")
const path = require("path")
const logger = require("morgan")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const auth = require("./middleswares/auth")
const reports = require("./routes/reports")
const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "x-auth-token",],
      credentials: true
    }
})
const users = require("./routes/users")(io)
const doctors = require('./routes/doctors')(io)
const appointments = require('./routes/appointments')(io)
const medications = require('./routes/medications')(io)
const questions = require('./routes/questions')(io)
const reviews = require('./routes/review')(io)
const login = require('./routes/login')
const healthFeeds = require('./routes/healthFeed')(io)
const documents = require('./routes/documents')(io)
const pushTokens = require('./routes/pushToken')
const notifications = require('./routes/notifications')
const messages = require('./routes/messages')(io)

app.use(express.json())
app.use(express.urlencoded( { extended : true } ))
app.use(express.static(path.join(__dirname, "public")))
app.use(logger("tiny"))
app.use(cors())
app.use(cookieParser())
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(auth)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, `/public/index.html`))
})

app.use('/login', login)
app.use('/users', users)
app.use('/doctors', doctors)
app.use('/reports', reports)
app.use('/appontments', appointments)
app.use('/medications', medications)
app.use('/questions', questions)
app.use('/reviews', reviews)
app.use('/healthFeeds', healthFeeds)
app.use('/documents', documents)
app.use('/pushTokens', pushTokens)
app.use('/notification', notifications)
app.use('/messages', messages)
// io.on("connection", socket => {
//     socket.on("user-connected", user => {
//         console.log(user)
//     })
//     socket.on("message", message => {
//         io.emit("message", message)
//     })
//     socket.on("new-user", user => {
//         io.emit("new-user", user)
//     })
// })

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

// const db = process.env.DB || 'mongodb://localhost/itelmed-demo'
const db = "mongodb://localhost/itelmed-test"
mongoose.connect(db, { useFindAndModify: false })
    .then(() => console.log("Connected to mongodb"))
    .catch(err => console.log("Cannot conntect to mongodb", err))

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Listening on port ${port}`))

app.use(function(req, res, next) {
    next(createError(404))
})

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app