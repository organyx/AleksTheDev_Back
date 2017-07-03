import mongoose from 'mongoose'
import { Router } from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import passport from 'passport'

import Project from '../model/project'

export default({ config, db }) => {
    // API Router
    let api = Router()

    // Logger
    const log = config.log()

    // '/v1/projects' - GET all projects
    api.get('/', (req, res) => {
        Project.find({}, (err, projects) => {
            // Check for error : 500
            if(err)
                res.status(500).send(err)
            // Send all Projects data back
            res.json(projects)
            log.info('Request for all Projects')
        })
    })

    // '/v1/projects/:id' - GET a specific project
    api.get('/:id', (req, res) => {
        Project.findById(req.params.id, (err, project) => {
            // Check for error : 500
            if(err) {
                res.status(500).send(err)
                return
            }
            // Check for error : 404 | Project not found
            if(project === null) {
                res.status(404).send('Project not found')
                return
            }
            // Send found Project back
            res.json(project)
            log.info('Request for project: ' + project)
        })
    })

    // '/v1/projects/new' - POST add new project    
    api.post('/new', passport.authenticate('jwt', { session: false }), (req, res) => {
        // Temp project with received data
        let newProject = new Project()
        newProject.name = req.body.name
        newProject.status = req.body.status
        newProject.description = req.body.description
        newProject.imgsUrls = req.body.imgsUrls

        log.info(newProject)
        // Save new Project
        newProject.save((err) => {
            // Check for error : 500
            if(err)
                res.status(500).send(err)
            // Confirm Project creation
            res.json({ response: `Project ${newProject.name} saved succesfully` })
        })
        log.info(`Project ${newProject.name} saved succesfully`)
    })

    // '/v1/projects/:id' - PUT - update an existing project
    api.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        // Query Project from DB
        Project.findById(req.params.id, (err, project) => {
            // Check for error : 500
            if(err) {
                res.status(500).send(err)
                return
            }
            // Check for error : 404 | Project not found
            if(project === null) {
                res.status(404).send('Project not found')
                return
            }
            // If no errors triggered update the project
            project.name = req.body.name
            project.status = req.body.status
            project.description = req.body.description
            project.imgsUrls = req.body.imgsUrls
            // Save updated project
            project.save((err) => {
                // Check for error : 500
                if(err)
                    res.status(500).send(err)
                // Confirm Project creation
                res.json({ response: `Project ${project.name} information updated`})
            })
            log.info(`Project ${project.name} information updated`)
        })
    })

	// '/v1/foodtruck/:id' - DELETE remove a project
    api.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        // Query Project from DB
        Project.findById(req.params.id, (err, project) => {
            // Check for error : 500
            if(err) {
                res.status(500).send(err)
                return
            }
            // Check for error : 404 | Project not found
            if(project === null) {
                res.status(404).send('Project not found')
                return
            }
            // Temporarily save deleted Project name
            const deletedPrj = project.name
            // Delete found Project from DB
            Project.remove({ _id: req.params.id }, (err, project) => {
                // Check for error : 500
                if(err) {
                    res.status(500).send(err)
                    return
                }
                // Confirm Project deletion
                res.json({ response: `Project ${deletedPrj} was removed`})
            })
            log.info(`Project ${deletedPrj} was removed`)
        })
    })

    return api
}