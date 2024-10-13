import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cloudinary from "cloudinary";
import MongoStore from 'connect-mongo';
import cors from "cors";


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(
    session({
      secret: process.env.SESSION_SECRET, // Replace with your own secret
      resave: false,                 // Don't save session if it hasn't been modified
      saveUninitialized: false,      // Don't create session until something is stored
      store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI, // Replace with your MongoDB connection string
        collectionName: 'sessions'  // Session collection in MongoDB
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // Session lasts 7 days
      },
    }) 
  );
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );

  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
  });
  

// Routes
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
