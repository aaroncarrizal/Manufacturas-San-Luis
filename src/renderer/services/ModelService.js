import axios from './axios'

export const createModel = async (model) => {
    return await axios.post('/models', model)
}

export const getModels = async () => {
    return await axios.get('/models')
}

export const getModel = async (modelId) => {
    return await axios.get(`/models/${modelId}`)
}

export const deleteModel = async (modelId) => {
    return await axios.delete(`/models/${modelId}`)
}

export const updateModel = async (id, model) => {
    return await axios.patch(`/models/${id}`, model)
}