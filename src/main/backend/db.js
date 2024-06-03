import Sequelize from 'sequelize'
import mysql from 'mysql2/promise'

// Create db if it doesnt exist
async function createDatabaseIfNotExists() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'user',
        password: 'password'
    })
    await connection.query(`CREATE DATABASE IF NOT EXISTS monterrey`)
    await connection.end()
}

const db = new Sequelize('monterrey', 'user', 'password', {
    host: '127.0.0.1',
    dialect: 'mysql'
})

db.connect = async function () {
    try {
        await createDatabaseIfNotExists()
        await db.authenticate()
        await db.sync()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

export default db
