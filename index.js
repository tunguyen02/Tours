import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import AppError from './utils/appError.js';
import errorHandler from './controller/errController.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

dotenv.config();
const app = express();
app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);
app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp(
    {
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    }
));

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB)
    .then(() => console.log('DB connection successful!'))
    .catch(err => console.log(err));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

