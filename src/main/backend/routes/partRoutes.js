import Part from '../models/Part'
import Token from '../models/Token'
import Model from '../models/Model'
import { Router } from 'express'
import { print } from '../..'
import PrintedLabel from '../models/PrintedLabel'

const router = Router()

// Get all parts
router.get('/parts', async (req, res) => {
    try {
        const parts = await Part.findAll()
        for (let part of parts) {
            // Search associated model
            let model = await Model.findByPk(part.modelId)
            // Insert model info to part
            part.dataValues.digits = model.digits
            part.dataValues.partNumber = model.partNumber
            part.dataValues.reference = model.reference
        }
        res.send(parts)
    } catch (error) {
        res.send(error)
    }
})

// Create a new part
router.post('/parts', async (req, res) => {
    try {
        const newPart = new Part(req.body)
        await newPart.save()
        // Occupy related token
        await Token.update(
            {
                isOccupied: true
            },
            { where: { id: newPart.tokenId } }
        )
        res.send(newPart)
    } catch (error) {
        console.log(error)
        res.status(404).send(error)
    }
})

// Get one part
router.get('/parts/:id', async (req, res) => {
    try {
        const part = await Part.findByPk(req.params.id)
        // Search associated model
        const model = await Model.findByPk(part.modelId)
        // Insert model info to part
        part.dataValues.digits = model.digits
        part.dataValues.partNumber = model.partNumber
        part.dataValues.reference = model.reference
        res.send(part)
    } catch (error) {
        res.status(404).send(error)
    }
})

// Edit one part
router.patch('/parts/:id', async (req, res) => {
    try {
        const oldPart = await Part.findByPk(req.params.id)
        await Part.update(
            {
                qr: req.body.qr,
                tokenId: req.body.tokenId,
                modelId: req.body.modelId
            },
            { where: { id: req.params.id } }
        )
        // Free old token
        await Token.update(
            {
                isOccupied: false
            },
            { where: { id: oldPart.tokenId } }
        )
        // Occuppy new token
        await Token.update(
            {
                isOccupied: true
            },
            { where: { id: req.body.tokenId } }
        )
        res.send(oldPart)
    } catch (error) {
        res.send(error)
    }
})

// Delete one part
router.delete('/parts/:id', async (req, res) => {
    try {
        const part = await Part.findByPk(req.params.id)
        const deletedPart = await Part.destroy({
            where: { id: req.params.id }
        })
        if (deletedPart != 0) {
            // Free related token
            await Token.update(
                {
                    isOccupied: false
                },
                { where: { id: part.tokenId } }
            )
            res.send('Part deleted succesfully')
        } else {
            throw new Error('No part found')
        }
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/parts/print/:id', async (req, res) => {
    try {
        // Find part
        const part = await Part.findByPk(req.params.id)
        const model = await Model.findByPk(part.modelId)
        if (part == null) {
            res.status(404).send('Part was not found')
            return
        }

        // Print label
        const result = await print(part, model)
        // Save printed data
        const printedLabel = await new PrintedLabel({
            qr: part.qr,
            digits: model.digits,
            partNumber: model.partNumber,
            reference: model.reference,
            tokenId: part.tokenId
        })
        await printedLabel.save()
        // Delete part
        await Part.destroy({
            where: { id: part.id }
        })

        // Free related token
        await Token.update(
            {
                isOccupied: false
            },
            { where: { id: part.tokenId } }
        )

        // Send response
        res.send({
            message: 'Etiqueta impresa con éxito',
            partId: part.id
        })
    } catch (error) {
        console.error(error)
        res.status(404).send(`Error: ${error}`)
    }
})

export default router
