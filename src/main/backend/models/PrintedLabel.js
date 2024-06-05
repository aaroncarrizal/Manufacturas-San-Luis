import { DataTypes } from 'sequelize'
import db from '../db'

const PrintedLabel = db.define('PrintedLabels', {
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
        defaultValue: 0
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default PrintedLabel