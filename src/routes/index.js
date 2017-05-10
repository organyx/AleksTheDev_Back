import express from 'express'

import config from '../config'
import mongodb from '../db'
import middleware from '../middleware'
import projects from '../controller/projects'

let router = express()
//Connect to DB
mongodb(db => {

    // internal middleware
    router.use(middleware({ config, db }))

    // api routes v1 
    router.use('/projects', projects({ config, db }))
})

export default router