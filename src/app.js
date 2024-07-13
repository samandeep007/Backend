import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import rateLimit from 'express-rate-limit';
import noteRouter from './routes/note.routes.js';
import searchRouter from './routes/search.routes.js';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again later.',
    headers: true,
  });



app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.static('public'));


app.use(limiter);


app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(cookieParser());

app.use("/api/auth/", userRouter);
app.use("/api/notes/", noteRouter);
app.use("/api/search", searchRouter);


export{app};