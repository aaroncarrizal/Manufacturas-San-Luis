import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import db from './db'
import partRoutes from './routes/partRoutes'
import tokenRoutes from './routes/tokenRoutes'
import modelRoutes from './routes/modelRoutes'
import printedLabelRoutes from './routes/printedLabelRoutes'

const backend = express()
backend.use(cors())
backend.use(morgan('dev'))
backend.use(express.json())
backend.use('/api', partRoutes)
backend.use('/api', tokenRoutes)
backend.use('/api', modelRoutes)
backend.use('/api', printedLabelRoutes)

// Connect db
db.connect()

// Express server
const startServer = (port) => {
    const server = backend.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use, trying port ${port + 1}`)
            startServer(port + 1)
        } else {
            console.error(error)
        }
    })
}

const initialPort = 3000
startServer(initialPort)

export default backend
