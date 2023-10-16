import PrintedLabel from '../models/PrintedLabel'
import { Router } from 'express'
import { print } from '../..'
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

router.get('/printedLabels/print/:id', async (req, res) => {
    try {
        // Find printed label and build printing objects
        const printedLabel = await PrintedLabel.findByPk(req.params.id)
        const part = {
            qr: printedLabel.qr,
            tokenId: printedLabel.id
        }
        const model = {
            partNumber: printedLabel.partNumber,
            digits: printedLabel.digits,
            reference: printedLabel.reference
        }
        // Print label
        const result = await print(part, model)

        // Send response
        res.send({
            message: 'Etiqueta impresa con éxito',
            printedLabelId: printedLabel.id
        })
    } catch (error) {
        console.error(error)
        res.status(404).send(`Error: ${error}`)
    }
})

export default router
