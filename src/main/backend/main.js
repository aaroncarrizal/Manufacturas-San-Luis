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
const port = 3000
backend.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

export default backend
