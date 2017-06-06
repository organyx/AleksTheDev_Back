import { Router } from 'express'
import _ from 'lodash'
import jwt from 'jsonwebtoken'

import config from '../config'
import User from '../model/user'

import passport from 'passport'
import passportJWT from 'passport-jwt'

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

module.exports = () => {
    let jwtOptions = { }
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader()
    jwtOptions.secretOrKey = config.secrets.jwtSecret

    let strategy = new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        console.log('Payload received', jwt_payload)
        let user = User.findOne({ id: jwt_payload.id }, (err, user) => {
            if(err) {
                console.log(`Error | ${err}`)
                return done(err, false, { message: `Error | ${err}`})
            }
            if(user) {
                console.log(`User ${user} found`)
                return done(null, user, { message: `User ${user} found`})
            } else {
                console.log('Invalid Login Credentials')
                return done(null, false, { message: 'Invalid Login Credentials' })
            }
        })
        
    })
    return strategy
}

    // passport.use(strategy)


// module.exports.strategy = strategy