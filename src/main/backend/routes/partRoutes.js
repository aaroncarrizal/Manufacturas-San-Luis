import Part from '../models/Part'
import Token from '../models/Token'
import { Router } from 'express'
import os from 'os'
import fs from 'fs'
import path from 'path'
const util = require('util')
const exec = util.promisify(require('child_process').exec)

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
    let filePath
    try {
        // Get name of the PC
        const hostname = os.hostname()
        const part = await Part.findByPk(req.params.id)
        if (part == null) {
            throw new Error('Part was not found')
        }
        filePath = path.join(__dirname, `${part.tokenId}.zpl`)
        fs.writeFileSync(filePath, 'content') // Write your content to the file

        // Print label
        const command = `COPY /B "${filePath}" "\\\\${hostname}\\ZDesigner"`
        // const command = `start explorer.exe `

        const { error, stdout, stderr } = await exec(command)

        if (error) {
            console.error(`Error: ${error.message}`)
            // Delete generated file
            fs.unlinkSync(filePath)
            res.status(500).send(`Error: ${error.message}`)
            return
        }

        if (stderr) {
            console.error(`Error: ${stderr}`)
            // Delete generated file
            fs.unlinkSync(filePath)
            res.status(500).send(`Error: ${stderr}`)
            return
        }

        console.log(`Command output:\n${stdout}`)

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
        // Delete generated file
        fs.unlinkSync(filePath)
        res.send('Operation completed successfully.')
    } catch (error) {
        console.error(error)
        // Delete generated file
        fs.unlinkSync(filePath)
        res.status(404).send(`Error: ${error.message}`)
    }
})

export default router
