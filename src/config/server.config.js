const { connectToDatabase, sequelize } = require("./postgresql.config");

const startServer = async (app) => {
    const PORT = process.env.PORT || 3000;

    try {
        const sequelize = await connectToDatabase()
        app.listen(process.env.PORT, () => {
            console.warn(`server is running on http://localhost:${PORT}/`)
        })
    } catch (error) {
        console.error("failed to start the server")
        process.exit(1)
    }
}
module.exports = startServer