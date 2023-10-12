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

export const printPart = async (partId) => {
    return await axios.get(`/parts/print/${partId}`)
}

export const updatePart = async (id, part) => {
    return await axios.patch(`/parts/${id}`, part)
}

export const deletePart = async (id) => {
    return await axios.delete(`/parts/${id}`)
}