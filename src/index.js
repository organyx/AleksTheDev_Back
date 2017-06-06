import http from 'http'
import express from 'express'

import config from './config'
import routes from './routes'

let app = express()
app.server = http.createServer(app)

// api routes v1
app.use('/api/v1', routes)

app.server.listen(process.env.port || config.port)
// app.server.listen(config.port)
console.log("Started on port " + app.server.address().port)

export default app