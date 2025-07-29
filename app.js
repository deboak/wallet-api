require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const authenticateUser = require('./middleware/authentication');


app.set('trust proxy', 1)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes.',
})

app.use(express.json());

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(xss());

// router
const authRouter = require('./routes/auth');
const walletRouter = require('./routes/walletRoutes');

app.get('/api/v1/ping', (req, res) => {
  res.status(200).json({ message: 'API is alive!' });
});

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/wallet', authenticateUser, walletRouter);

// error handler
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');

// // Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


// const port = process.env.PORT || 3001;

// const start = async () => {
//     try {
//         await connectDB(process.env.MONGO_URI);
//         app.listen(port, () => {
//             console.log(`Server is listening on port ${port}...`);
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// start();

module.exports = app; 


