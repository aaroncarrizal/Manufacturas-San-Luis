import Token from '../models/Token'
import { Router } from 'express'
const router = Router()

// Get all tokens
router.get('/tokens', async (req, res) => {
    try {
        const tokens = await Token.findAll()
        res.send(tokens)
    } catch (error) {
        res.send(error)
    }
})

// Get all tokens where isOccupied is false
router.get('/freeTokens', async (req, res) => {
    try {
        const tokens = await Token.findAll({
            where: {
                isOccupied: false
            }
        })
        res.send(tokens)
    } catch (error) {
        res.send(error)
    }
})

// Create a new token
router.post('/tokens', async (req, res) => {
    try {
        const newToken = new Token(req.body)
        await newToken.save()
        res.send(newToken)
    } catch (error) {
        console.log(error)
    }
})

// Create multiple tokens
router.post('/tokens/:count', async (req, res) => {
    try {
        for (let i = 0; i < req.params.count; i++) {
            const newToken = new Token({ isOccupied: false })
            await newToken.save()
        }
        res.send('Tokens created')
    } catch (error) {
        console.log(error)
    }
})

// Get one token
router.get('/tokens/:id', async (req, res) => {
    try {
        const token = await Token.findByPk(req.params.id)
        res.send(token)
    } catch (error) {
        res.status(404).send(error)
    }
})

// Edit one token
router.patch('/tokens/:id', async (req, res) => {
    try {
        const updatedToken = await Token.update(
            { isOccupied: req.body.isOccupied },
            { where: { id: req.params.id } }
        )
        res.send(updatedToken)
    } catch (error) {
        res.send(error)
    }
})

// Delete one token
router.delete('/tokens/:id', async (req, res) => {
    try {
        const token = await Token.destroy({
            where: { id: req.params.id }
        })
        if (token != 0) {
            res.send('Token deleted succesfully')
        } else {
            throw new Error('No token found')
        }
    } catch (error) {
        res.status(404).send(error)
    }
})

export default router
