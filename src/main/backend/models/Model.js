import { DataTypes } from 'sequelize'
import db from '../db'

const Model = db.define('Models', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    digits: {
        type: DataTypes.STRING,
        allowNull: false
    },
    partNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Model