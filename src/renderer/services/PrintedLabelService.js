import axios from './axios'

export const getPrintedLabels = async () => {
    return await axios.get('/printedLabels')
}

export const getPrintedLabel = async (printedLabelId) => {
    return await axios.get(`/printedLabels/${printedLabelId}`)
}

export const reprintPrintedLabel = async (printedLabelId) => {
    return await axios.get(`/printedLabels/print/${printedLabelId}`)
}