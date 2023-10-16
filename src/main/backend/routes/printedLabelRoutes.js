import PrintedLabel from '../models/PrintedLabel'
import { Router } from 'express'

const router = Router()

// Get all printedLabels
router.get('/printedLabels', async (req, res) => {
    try {
        const printedLabels = await PrintedLabel.findAll()
        res.send(printedLabels)
    } catch (error) {
        res.send(error)
    }
})

// Create a new printedLabel
router.post('/printedLabels', async (req, res) => {
    try {
        const newPrintedLabel = new PrintedLabel(req.body)
        await newPrintedLabel.save()
        res.send(newPrintedLabel)
    } catch (error) {
        console.log(error)
        res.status(404).send(error)
    }
})

// Get one printedLabel
router.get('/printedLabels/:id', async (req, res) => {
    try {
        const printedLabel = await PrintedLabel.findByPk(req.params.id)
        res.send(printedLabel)
    } catch (error) {
        res.status(404).send(error)
    }
})

export default router
