import axios from './axios'

export const createToken = async (token) => {
    return await axios.post('/tokens', token)
}
export const createMultipleTokens = async (token, count) => {
    return await axios.post(`/tokens/${count}`, token)
}

export const getTokens = async () => {
    return await axios.get('/tokens')
}

export const getFreeTokens = async () => {
    return await axios.get('/freeTokens')
}
