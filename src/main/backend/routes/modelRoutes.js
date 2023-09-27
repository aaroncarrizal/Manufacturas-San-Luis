import Model from '../models/Model'
import { Router } from 'express'

const router = Router()

// Get all models
router.get('/models', async (req, res) => {
    try {
        const models = await Model.findAll()
        res.send(models)
    } catch (error) {
        res.send(error)
    }
})

// Create a new model
router.post('/models', async (req, res) => {
    try {
        const newModel = new Model(req.body)
        await newModel.save()
        res.send(newModel)
    } catch (error) {
        console.log(error)
        res.status(404).send(error)
    }
})

// Get one model
router.get('/models/:id', async (req, res) => {
    try {
        const model = await Model.findByPk(req.params.id)
        res.send(model)
    } catch (error) {
        res.status(404).send(error)
    }
})

// Edit one model
router.patch('/models/:id', async (req, res) => {
    try {
        const updatedModel = await Model.update(
            {
                digits: req.body.digits,
                model: req.body.model,
                reference: req.body.reference
            },
            { where: { id: req.params.id } }
        )
        res.send(updatedModel)
    } catch (error) {
        res.send(error)
    }
})

// Delete one model
router.delete('/models/:id', async (req, res) => {
    try {
        const model = await Model.destroy({
            where: { id: req.params.id }
        })
        if (model != 0) {
            res.send('Part number deleted succesfully')
        } else {
            throw new Error('No part number found')
        }
    } catch (error) {
        res.status(404).send(error)
    }
})

export default router
