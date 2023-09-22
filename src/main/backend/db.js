import Sequelize from 'sequelize'

const db = new Sequelize('test', 'root', 'root', {
    host: '127.0.0.1',
    dialect: 'mysql'
})

db.connect = async function () {
    try {
        await db.authenticate()
        await db.sync()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
        }
}

export default db

