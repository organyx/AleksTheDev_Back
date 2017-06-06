import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'

import User from '../model/user'

export default({ config, db }) => {
    let router = Router()

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
            console.log(`User ${user.email} created succesfully`)
        })
    })

    // router.post('/login', (req, res) => {
    //     User.findOne({ email: req.body.email }, (err, user) => {
    //         if(err) {
    //             return res.status(500).json({
    //                 title: 'An error occured',
    //                 error: err
    //             })
    //         }
    //         if(!user) {
    //             return res.status(401).json({
    //                 title: 'Login Failed',
    //                 error: { message: 'Invalid login information' }
    //             })
    //         }
    //         if(!bcrypt.compareSync(req.body.password, user.password)) {
    //             return res.status(401).json({
    //                 title: 'Login Failed',
    //                 error: { message: 'Invalid login information' }
    //             })
    //         }
    //         let token = jwt.sign({ user: user }, 'secret', { expiresIn: 7200 })
    //         res.status(200).json({
    //             message: 'Login Succesfull',
    //             token: token,
    //             userId: user._id
    //         })
    //         console.log(`User ${user.email} logged in succesfully`)
    //     })
    // })

    // router.post('/login', (req, res) => {
    //     let emailReceived = ''
    //     let password = ''
    //     if(req.body.email && req.body.password) {
    //         emailReceived = req.body.email
    //         password = req.body.password
    //     }

    //     User.findOne({ email: emailReceived }, (err, user) => {
    //         if(err) {
    //             return res.status(500).json({
    //                 title: 'An error occured',
    //                 error: err
    //             })
    //         }
    //         if(!user) {
    //             return res.status(401).json({
    //                 title: 'Login Failed',
    //                 error: { message: 'Invalid login information' }
    //             })
    //         }
    //         if(!bcrypt.compareSync(req.body.password, user.password)) {
    //             return res.status(401).json({
    //                 title: 'Login Failed',
    //                 error: { message: 'Invalid login information' }
    //             })
    //         }
    //         const payload = { id: user.id }
    //         const token = jwt.sign(payload, config.secrets.jwtSecret)
    //         res.json({ message: 'Login Succesful ', token: token, userId: user._id })
    //         console.log(`User ${user.email} logged in succesfully`)
    //     })
    // })

    // router.post('/login', passport.authenticate('jwt', { session: false }), (req, res) => {
    //     // passport.authenticate('jwt', (err, user, info) => {
            
    //     // })

    //     // if(err) {
    //     //         console.error(err)
    //     //         return res.status(500).json({
    //     //             title: 'An error occured',
    //     //             error: err
    //     //         })
    //     //     }
    //     //     if(!user) {
    //     //         return res.status(401).json({
    //     //             title: 'Login Failed',
    //     //             error: { message: 'Invalid login information' }
    //     //         })
    //     //     }
    //     //     const token = jwt.sign(user, config.secrets.jwtSecret, { expiresIn: 63113904 })
    //     //     res.json({ message: 'Login Succesful ', token: token, userId: user._id })
    //     //     console.log(`User ${user.email} logged in succesfully`)
    // })

    // router.post('/login', (req, res, next) => {
    //     passport.authenticate('jwt', (err, user, info) => {
    //         if(err) {
    //             console.error(err)
    //             return res.status(500).json({
    //                 title: 'An error occured',
    //                 error: err
    //             })
    //         }
    //         if(!user) {
    //             return res.status(401).json({
    //                 title: 'Login Failed',
    //                 error: { message: 'Invalid login information' }
    //             })
    //         }
    //         const token = jwt.sign(user, config.secrets.jwtSecret, { expiresIn: 63113904 })
    //         res.json({ message: 'Login Succesful ', token: token, userId: user._id })
    //         console.log(`User ${user.email} logged in succesfully`)
    //     }) (req, res, next)
    // })

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
                    console.log(`User ${user.email} logged in succesfully`)
                } else {
                    res.send({ message: 'Authentication failed, passwords dont match' })
                }
            })
        })  
    })
    return router
}
