import axios from './axios'

export const createPart = async (part) => {
    return await axios.post('/parts', part)
}

export const getParts = async () => {
    return await axios.get('/parts')
}

export const getPart = async (partId) => {
    return await axios.get(`/parts/${partId}`)
}
