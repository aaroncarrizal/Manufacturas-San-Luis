import { DataTypes } from 'sequelize'
import db from '../db'
import Token from './Token'
import Model from './Model'

const Part = db.define('Parts', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    qr: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tokenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true // Add this line to enforce uniqueness
    },
    modelId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

Part.belongsTo(Token, {
    foreignKey: 'tokenId', // Specify the same foreign key here
    allowNull: false
})

Part.belongsTo(Model, {
    foreignKey: 'modelId',
    onDelete: 'RESTRICT',
    allowNull: false
})

export default Part
