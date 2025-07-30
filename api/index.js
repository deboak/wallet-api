const app = require('../app');
const connectDB = require('../db/connect');

const port = process.env.PORT || 3001;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        })
    } catch (error) {
        console.log('Failed to connect to MongoDB:', error);
    }
}

start();


module.exports = app;