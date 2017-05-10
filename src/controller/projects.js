import mongoose from 'mongoose'
import { Router } from 'express'
import bodyParser from 'body-parser'

import Project from '../model/project'

export default({ config, db }) => {
    let api = Router()

    // '/v1/projects' - GET all projects
    api.get('/', (req, res) => {
        Project.find({}, (err, projects) => {
            if(err)
                res.send(err)
            res.json(projects)
        })
    })

    // '/v1/projects/:id' - GET a specific project
    api.get('/:id', (req, res) => {
        Project.findById(req.params.id, (err, project) => {
            if(err)
                res.send(err)
            res.json(project)
        })
    })

    // '/v1/projects/new' - POST add new project    
    api.post('/new', (req, res) => {
        let newProject = new Project()
        newProject.name = req.body.name
        newProject.status = req.body.status
        newProject.description = req.body.description
        newProject.imgsUrls = req.body.imgsUrls

        newProject.save((err) => {
            if(err)
                res.send(err)
            res.json({ response: `Project ${newProject.name} saved succesfully` })
        })
    })

    // '/v1/projects/:id' - PUT - update an existing project
    api.put('/:id', (req, res) => {
        Project.findById(req.params.id, (err, project) => {
            if(err)
                res.send(err)
            project.name = req.body.name
            project.status = req.body.status
            project.description = req.body.description
            project.imgsUrls = req.body.imgsUrls
            project.save((err) => {
                if(err)
                    res.send(err)
                res.json({ response: `Project ${project.name} information updated`})
            })
        })
    })

	// '/v1/foodtruck/:id' - DELETE remove a project
    api.delete('/:id', (req, res) => {
		// Project.remove({_id: req.params.id}, (err, project) => {
		// 	if(err)
		// 		res.send(err)
		// 	res.json({ response: `Project ${project.name} was removed`})
		// })
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
                
        })
    })

    return api
}