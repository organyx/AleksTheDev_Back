import { Router } from 'express'
import bcrypt from 'bcryptjs'

import User from '../model/user'

export default({ config, db }) => {
    let router = Router()

    const log = config.log()

    router.post('/', (req, res) => {
        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.email
        })
        user.save((err, result) => {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                })
            }
            res.status(201).json({
                message: 'User created',
                obj: result
            })
            log.info(`User ${user.email} created succesfully`)
        })
    })

    router.post('/login', (req, res) => {
        User.findOne({ email: req.body.email }, (err, user) => {
            if(err) {
                return res.status(500).json({
                    message: 'An error occured',
                    error: err
                })
            }
            if(!user) {
                return res.status(401).json({
                    message: 'Login Failed',
                    error: { message: 'Invalid login information' }
                })
            }
            if(!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).json({
                    message: 'Login Failed',
                    error: { message: 'Invalid login information' }
                })
            }
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                // if user is found and password is right create a token
                    var token = user.generateAuthToken()
                // return the information including token as JSON
                    res.status(200).json({
                        message: 'Login Succesfull',
                        token: token,
                        userId: user._id
                    })
                    log.info(`User ${user.email} logged in succesfully`)
                } else {
                    res.send({ message: 'Authentication failed, passwords dont match' })
                }
            })
        })  
    })
    return router
}
