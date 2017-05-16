import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../model/user'

export default({ config, db }) => {
    let router = Router()

    router.post('/', (req, res) => {
        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: bcrypt.hashSync(req.body.password, 10),
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
            console.log(`User ${user.name} created succesfully`)
        })
    })

    router.post('/signin', (req, res) => {
        User.findOne({ email: req.body.email }, (err, user) => {
            if(err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                })
            }
            if(!user) {
                return res.status(401).json({
                    title: 'Login Failed',
                    error: { message: 'Invalid login information' }
                })
            }
            if(!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).json({
                    title: 'Login Failed',
                    error: { message: 'Invalid login information' }
                })
            }
            let token = jwt.sign({ user: user }, 'secret', { expiresIn: 7200 })
            res.status(200).json({
                message: 'Login Succesfull',
                token: token,
                userId: user._id
            })
            console.log(`User ${user.name} logged in succesfully`)
        })
    })


    return router
}
