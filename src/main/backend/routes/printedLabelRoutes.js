import PrintedLabel from '../models/PrintedLabel'
import { Router } from 'express'
import { print } from '../..'
import { Workbook } from 'exceljs'
import { Op } from 'sequelize'
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

// Reprint a label
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

function getFormattedDate() {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} - ${hours}:${minutes}`
}

// Export all printed labels as XLSX file
router.get('/export/printedLabels/all', async (req, res) => {
    const formattedDate = getFormattedDate()
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet(`Reporte`)
    try {
        // get all labels
        const printedLabels = await PrintedLabel.findAll()
        // Write the results in the xlsx
        worksheet.columns = [
            { header: 'QR', key: 'qr', width: 20 },
            { header: 'Dígitos', key: 'digits', width: 15 },
            { header: 'Núero de parte', key: 'partNumber', width: 15 },
            { header: 'Referencia', key: 'reference', width: 15 },
            { header: 'Ficha que se usó', key: 'tokenId', width: 15 },
            { header: 'Fecha de impresión', key: 'createdAt', width: 20 }
        ]
        printedLabels.forEach((label) => {
            worksheet.addRow(label.dataValues)
        })
        // generate the buffer
        const xlsxBuffer = await workbook.xlsx.writeBuffer()
        // Set res headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader('Content-Disposition', `attachment; filename=Reporte - ${formattedDate}.xlsx`)
        res.send(xlsxBuffer)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al consultar la base de datos' })
    }
})

// Export all printed labels from today as XLSX file
router.get('/export/printedLabels/today', async (req, res) => {
    const formattedDate = getFormattedDate()
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet(`Reporte`)
    try {
        // Calculate 24hrs ago
        const twentyFourHoursAgo = new Date()
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

        // get the printed labels created at most 24hr ago
        const printedLabels = await PrintedLabel.findAll({
            where: {
                createdAt: {
                    [Op.gte]: twentyFourHoursAgo
                }
            }
        })
        // Write the results in the xlsx
        worksheet.columns = [
            { header: 'QR', key: 'qr', width: 20 },
            { header: 'Dígitos', key: 'digits', width: 15 },
            { header: 'Núero de parte', key: 'partNumber', width: 15 },
            { header: 'Referencia', key: 'reference', width: 15 },
            { header: 'Ficha que se usó', key: 'tokenId', width: 15 },
            { header: 'Fecha de impresión', key: 'createdAt', width: 20 }
        ]
        printedLabels.forEach((label) => {
            worksheet.addRow(label.dataValues)
        })
        // generate the buffer
        const xlsxBuffer = await workbook.xlsx.writeBuffer()
        // Set res headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader('Content-Disposition', `attachment; filename=ReporteDiario - ${formattedDate}.xlsx`)
        res.send(xlsxBuffer)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al consultar la base de datos' })
    }
})

// Export all printed labels from this week as XLSX file
router.get('/export/printedLabels/week', async (req, res) => {
    const formattedDate = getFormattedDate()
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet(`Reporte`)
    try {
        // Calculate 1 week ago
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        // get the printed labels created at most 1 week ago
        const printedLabels = await PrintedLabel.findAll({
            where: {
                createdAt: {
                    [Op.gte]: oneWeekAgo
                }
            }
        })
        // Write the results in the xlsx
        worksheet.columns = [
            { header: 'QR', key: 'qr', width: 20 },
            { header: 'Dígitos', key: 'digits', width: 15 },
            { header: 'Núero de parte', key: 'partNumber', width: 15 },
            { header: 'Referencia', key: 'reference', width: 15 },
            { header: 'Ficha que se usó', key: 'tokenId', width: 15 },
            { header: 'Fecha de impresión', key: 'createdAt', width: 20 }
        ]
        printedLabels.forEach((label) => {
            worksheet.addRow(label.dataValues)
        })
        // generate the buffer
        const xlsxBuffer = await workbook.xlsx.writeBuffer()
        // Set res headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader('Content-Disposition', `attachment; filename=Reporte - ${formattedDate}.xlsx`)
        res.send(xlsxBuffer)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al consultar la base de datos' })
    }
})

// Export all printed labels from this week as XLSX file
router.get('/export/printedLabels/month', async (req, res) => {
    const formattedDate = getFormattedDate()
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet(`Reporte`)
    try {
        // Calculate 1 month ago
        const oneMonthAgo = new Date()
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)

        // get the printed labels created at most 1 month ago
        const printedLabels = await PrintedLabel.findAll({
            where: {
                createdAt: {
                    [Op.gte]: oneMonthAgo
                }
            }
        })
        // Write the results in the xlsx
        worksheet.columns = [
            { header: 'QR', key: 'qr', width: 20 },
            { header: 'Dígitos', key: 'digits', width: 15 },
            { header: 'Núero de parte', key: 'partNumber', width: 15 },
            { header: 'Referencia', key: 'reference', width: 15 },
            { header: 'Ficha que se usó', key: 'tokenId', width: 15 },
            { header: 'Fecha de impresión', key: 'createdAt', width: 20 }
        ]
        printedLabels.forEach((label) => {
            worksheet.addRow(label.dataValues)
        })
        // generate the buffer
        const xlsxBuffer = await workbook.xlsx.writeBuffer()
        // Set res headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader('Content-Disposition', `attachment; filename=ReporteMensual - ${formattedDate}.xlsx`)
        res.send(xlsxBuffer)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al consultar la base de datos' })
    }
})

export default router
