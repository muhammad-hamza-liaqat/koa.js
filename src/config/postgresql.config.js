const { Sequelize } = require('sequelize')
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.USER_NAME,
    process.env.PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.PORT_DB,
        logging: true
    }
)

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ alter: true })
        console.log('Connection to PostgreSQL database established successfully.')
        console.log(`${process.env.DATABASE_NAME}`)

        await sequelize.sync({ alter: true })
        console.log('Database & tables synchronized successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
        throw error
    }
}

module.exports = { sequelize, connectToDatabase }