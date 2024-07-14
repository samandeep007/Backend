import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import rateLimit from 'express-rate-limit';
import noteRouter from './routes/note.routes.js';
import searchRouter from './routes/search.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express();


// Limit requests to a maximum of 100 requests per minute per IP address
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again later.',
    headers: true,
});

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Apply rate limiting middleware
app.use(limiter);

// Parse JSON request bodies
app.use(express.json({
    limit: "16kb"
}));

// Parse URL-encoded request bodies
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

// Parse cookies
app.use(cookieParser());

// Mount user routes
app.use("/api/auth", userRouter);

// Mount note routes
app.use("/api/notes", noteRouter);

// Mount search routes
app.use("/api/search", searchRouter);

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


export { app };
