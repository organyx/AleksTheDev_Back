import { Router } from 'express'
import _ from 'lodash'
import jwt from 'jsonwebtoken'

import config from '../config'
import User from '../model/user'

import passport from 'passport'
import passportJWT from 'passport-jwt'

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const log = config.log()

module.exports = () => {
    let jwtOptions = { }
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader()
    jwtOptions.secretOrKey = config.secrets.jwtSecret

    let strategy = new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        log.info('Payload received', jwt_payload)
        let user = User.findOne({ id: jwt_payload.id }, (err, user) => {
            if(err) {
                log.error(`Error | ${err}`)
                return done(err, false, { message: `Error | ${err}`})
            }
            if(user) {
                log.info(`User ${user} found`)
                return done(null, user, { message: `User ${user} found`})
            } else {
                log.info('Invalid Login Credentials')
                return done(null, false, { message: 'Invalid Login Credentials' })
            }
        })
        
    })
    return strategy
}
