import mongoose from 'mongoose'
import { Router } from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import passport from 'passport'

import Project from '../model/project'

export default({ config, db }) => {
    let api = Router()

    // '/v1/projects' - GET all projects
    api.get('/', (req, res) => {
        Project.find({}, (err, projects) => {
            if(err)
                res.status(500).send(err)
            res.json(projects)
            console.log('Request for all Projects')
        })
    })

    // '/v1/projects/:id' - GET a specific project
    api.get('/:id', (req, res) => {
        Project.findById(req.params.id, (err, project) => {
            if(err) {
                res.status(500).send(err)
                return
            }
            if(project === null) {
                res.status(404).send('Project not found')
                return
            }
            res.json(project)
            console.log('Request for project: ' + project)
        })
    })

    // '/v1/projects/new' - POST add new project    
    api.post('/new', passport.authenticate('jwt', { session: false }), (req, res) => {
        let newProject = new Project()
        newProject.name = req.body.name
        newProject.status = req.body.status
        newProject.description = req.body.description
        newProject.imgsUrls = req.body.imgsUrls

        console.log(newProject)
        newProject.save((err) => {
            if(err)
                res.status(500).send(err)
            res.json({ response: `Project ${newProject.name} saved succesfully` })
        })
        console.log(`Project ${newProject.name} saved succesfully`)
    })

    // '/v1/projects/:id' - PUT - update an existing project
    api.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        Project.findById(req.params.id, (err, project) => {
            if(err) {
                res.status(500).send(err)
                return
            }
            if(project === null) {
                res.status(404).send('Project not found')
                return
            }
            project.name = req.body.name
            project.status = req.body.status
            project.description = req.body.description
            project.imgsUrls = req.body.imgsUrls
            project.save((err) => {
                if(err)
                    res.status(500).send(err)
                res.json({ response: `Project ${project.name} information updated`})
            })
            console.log(`Project ${project.name} information updated`)
        })
    })

	// '/v1/foodtruck/:id' - DELETE remove a project
    api.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        Project.findById(req.params.id, (err, project) => {
            if(err) {
                res.status(500).send(err)
                return
            }
            if(project === null) {
                res.status(404).send('Project not found')
                return
            }
            const deletedPrj = project.name
            Project.remove({ _id: req.params.id }, (err, project) => {
                if(err) {
                    res.status(500).send(err)
                    return
                }
                res.json({ response: `Project ${deletedPrj} was removed`})
            })
            console.log(`Project ${deletedPrj} was removed`)
        })
    })

    function checkAuth(req, res, next) {
        if(!req.header('authorization')) {
            return res.status(401).send({ response: 'Unatuhorized request. Missing Auth Header' })
        }

        let token = req.header('authorization').split(' ')[1]
        let payload = jwt.decode(token, config.secrets.jwtSecret)

        if(!payload) {
            return res.status(401).send({ response: 'Unatuhorized request. Auth Header is Invalid' })
        }
        console.log(`Payload ${payload}`)
        req.user = payload
        next()
    }

    function checkAuth2(req, res, next) {
        passport.authenticate('jwt', { session: false }, (req, res) => {
            res.json('Logged In')
        })
        next()
    }

    return api
}