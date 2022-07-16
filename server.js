
// DEPENDENCIES
let express = require('express')
let app = express()
let cookieSession = require('cookie-session')
let usersController = require('./controllers/users-controller')
let projectsController = require('./controllers/projects-controller')
let tasksController = require('./controllers/tasks-controller')
let authController = require('./controllers/authentication')
let cors = require('cors')
let whitelist = ['https://taskmaster-io.herokuapp.com/']
let corsOptions = {
    credentials : true,
    origin: (origin, callback)=>{
        if(whitelist.includes(origin))
        return callback(null, true)

        callback(new Error('Not allowed by CORS'))
    }

}
// let { Sequelize } = require('sequelize')

// CONFIG
require('dotenv').config()
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieSession({
    name:'session',
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000
}))


// ROOT
app.get('/',(req,res)=>{
    res.status(200).send("Taskmaster here, what do you want?")
})

app.listen(process.env.PORT,()=>{
    console.log(`Taskmaster is live and listening on port ${process.env.PORT}`)
})


// CONTROLLERS
app.use('/users', usersController)
app.use('/projects', projectsController)
app.use('/tasks', tasksController)
app.use('/auth',authController)