const app = require('./app');
const connectDB = require('./db/connect');
const port = process.env.PORT || 3001;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('connected to MongoDB');
        
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        })
    } catch (error) {
        console.log('failed to connect to MongoDB:', error);
        process.exit(1); 
    }
}

start();