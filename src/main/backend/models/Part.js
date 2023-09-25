import { DataTypes } from 'sequelize'
import db from '../db'
import Token from './Token'

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
    },
    tokenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true // Add this line to enforce uniqueness
    }
})

Part.belongsTo(Token, {
    foreignKey: 'tokenId', // Specify the same foreign key here
    allowNull: false
})

export default Part
