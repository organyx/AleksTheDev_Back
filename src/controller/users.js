import { Router } from 'express'
import bcrypt from 'bcryptjs'

import User from '../model/user'

export default({ config, db }) => {
    // API Router
    let router = Router()
    // Logger
    const log = config.log()

    // '/v1/users' - POST add new user   
    router.post('/', (req, res) => {
        // Temp User with received data
        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.email
        })
        // Save new Project
        user.save((err, result) => {
            // Check for error : 500
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                })
            }
            // Confirm Project creation : 201 | User created succesfully
            res.status(201).json({
                message: 'User created',
                obj: result
            })
            log.info(`User ${user.email} created succesfully`)
        })
    })

    // '/v1/users/login' - POST login user  
    router.post('/login', (req, res) => {
        // Query User from DB
        User.findOne({ email: req.body.email }, (err, user) => {
            // Check for error : 500
            if(err) {
                return res.status(500).json({
                    message: 'An error occured',
                    error: err
                })
            }
            // Check for error : 401 | User Not found
            if(!user) {
                return res.status(401).json({
                    message: 'Login Failed',
                    error: { message: 'Invalid login information' }
                })
            }
            // Check for error : 401 | Invalid login information
            if(!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).json({
                    message: 'Login Failed',
                    error: { message: 'Invalid login information' }
                })
            }
            // Check for matching passwords
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                // If user is found and password is right create a Token
                    var token = user.generateAuthToken()
                // Return the information including Token as JSON : 200 | Login successfull
                    res.status(200).json({
                        message: 'Login Succesfull',
                        token: token,
                        userId: user._id
                    })
                    log.info(`User ${user.email} logged in succesfully`)
                } else {
                    // If passwords do not match : 401 | Auth Failed
                    res.send({ message: 'Authentication failed, passwords dont match' })
                }
            })
        })  
    })
    return router
}
