import { Router } from 'express'

import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import passport from 'passport'
import passportStrtg from '../middleware/auth'

export default({ config, db }) => {
    let api = Router()

    api.use(bodyParser.json({
        limit : config.bodyLimit
    }))
    api.use(bodyParser.urlencoded({
        extended: true
    }))
    api.use(cors())
    api.use(morgan('dev'))
    passport.use('jwt', passportStrtg())
    api.use(passport.initialize())

    return api
}