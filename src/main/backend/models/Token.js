import { DataTypes } from 'sequelize'
import db from '../db'

const Token = db.define('Tokens', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    isOccupied: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

export default Token
