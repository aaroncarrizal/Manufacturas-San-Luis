import Part from '../models/Part'
import Token from '../models/Token'
import Model from '../models/Model'
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
        const updatedPart = await Part.update(
            {
                qr: req.body.qr,
                tokenId: req.body.tokenId,
                modelId: req.body.modelId
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
    console.log('asdfasdfasfadfas');
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
    let filePath
    try {
        // Find part
        const part = await Part.findByPk(req.params.id)
        const model = await Model.findByPk(part.modelId)
        if (part == null) {
            res.status(404).send('Part was not found')
            return
        }

        // Create zpl file
        filePath = path.join(__dirname, `${part.tokenId}.txt`)

        const zpl = `^XA

        ^FO120,20 // Initial position for QR code
        ^BXN,10,200 // Data Matrix QR code
        ^FDMA,${part.qr} ^FS // End QR code data
        ^BY1,1 // Module width and height of 1 dot

        ^LH0,0
        ^FO300,25^A0B,25,20^FD${part.qr}^FS

        ^FO350,20
        ^A0N,36,36
        ^FD${model.digits}^FS

        ^FO350,70^GB50,10,10^FS
        ^FO420,70^GB50,10,10^FS

        ^FO350,120
        ^A0N,30,30
        ^FD${model.reference}^FS
        ^XZ`

        // console.log(zpl)

        fs.writeFileSync(filePath, zpl) // Write your content to the file

        // Get name of the PC
        const hostname = os.hostname()
        // Print label
        const command = `COPY /B "${filePath}" "\\\\${hostname}\\impresora"`
        // const command = `start explorer.exe `
        const { error, stdout, stderr } = await exec(command)

        if (error) {
            console.error(`Error: ${error.message}`)
            // Delete generated file
            fs.unlinkSync(filePath)
            res.status(500).send(`Error exec: ${error.message}`)
            return
        }

        if (stderr) {
            console.error(`Error: ${stderr}`)
            // Delete generated file
            fs.unlinkSync(filePath)
            res.status(500).send(`STDErr: ${stderr}`)
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
        // Send response
        res.send({
            message: 'Etiqueta impresa con éxito',
            partId: part.id
        })
    } catch (error) {
        console.error(error)
        // Delete generated file
        fs.unlinkSync(filePath)
        res.status(404).send(`Error: ${error}`)
    }
})

export default router
