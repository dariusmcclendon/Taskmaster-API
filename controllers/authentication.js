let auth = require('express').Router()
let db = require('../models')
let bcrypt = require('bcryptjs')

let { User } = db

auth.post('/signup', async (req,res)=>{
    let {password, ...rest} = req.body;
    try {
        const newUser = await User.create({
            ...rest,
            password: await bcrypt.hash(password, 10)
        })
        res.status(200).json(newUser)
    } catch (err){
        res.status(500).json(err)
    }
    
})

auth.post('/login/', async (req,res)=>{
    try {
        let user = await User.findOne({
            where: {username: req.body.username}
        })
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            res.status(404).json({
                message: `Incorrect username or password.`
            })
        } else {
            req.session.user_id = user.user_id
            res.status(200).json({user})
        }
    }
   catch (err) {
    console.log(err)
    res.status(500).json(err)
   }
})

auth.post('/signout/', async (req,res)=>{
    req.session.user_id = null
    res.status(200).json({message:'signed out'})
})
auth.get('/profile', async (req,res)=>{
    console.log(req.session.user_id)
    try {
        let user = await User.findOne({
            where : { user_id : req.session.user_id }
        })
        if(!user){
            res.status(500).json(null)
        } else {
            let sentUser = {
                user_id : user.user_id,
                display_name : user.display_name
            }
            res.status(200).json(sentUser)
        }
        
    } catch (err) {
        res.status(404).json({
            message: `En error occured.`
        })
        console.log(err)
    }
})

module.exports = auth