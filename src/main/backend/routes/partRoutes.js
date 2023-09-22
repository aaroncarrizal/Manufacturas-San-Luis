import Part from '../models/Part'
import Token from '../models/Token'
import { Router } from 'express'
const router = Router()

// Get all parts
router.get('/parts', async (req, res) => {
    try {
        const parts = await Part.findAll()
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
        res.send(part)
    } catch (error) {
        res.status(404).send(error)
    }
})

// Edit one part
router.patch('/parts/:id', async (req, res) => {
    try {
        const updatedPart = await Part.update(
            {
                qr: req.body.qr,
                sku: req.body.sku,
                tokenId: req.body.tokenId
            },
            { where: { id: req.params.id } }
        )
        res.send(updatedPart)
    } catch (error) {
        res.send(error)
    }
})

// Delete one part
router.delete('/parts/:id', async (req, res) => {
    try {
        const part = await Part.destroy({
            where: { id: req.params.id }
        })
        if (part != 0) {
            // Free related token
            await Token.update(
                {
                    isOccupied: false
                },
                { where: { id: newPart.tokenId } }
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
        const part = await Part.findByPk(req.params.id)
        const zpl = `^XA
^PW480  // Set the label print width to 5 cm (5 cm * 203 dpi = 480 dots)
^LL200  // Set the label length to 2 cm (2 cm * 203 dpi = 200 dots)
^FO0,10
^BQN,2,10
^FDMA,${part.qr}
^FS
^FO300,50
^A0N,30,30  // Set font size, 30 dots wide and 30 dots high
^FD
SKU: ${part.sku}
^FS
^XZ`
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

        res.setHeader('Content-disposition', `attachment; filename=${part.tokenId}.zpl`)
        res.setHeader('Content-type', 'application/octet-stream') // Use the appropriate content type for ZPL
        res.send(zpl)
    } catch (error) {
        res.status(404).send(error)
    }
})

export default router
