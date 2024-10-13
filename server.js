import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cloudinary from "cloudinary";
import MongoStore from 'connect-mongo';
import cors from "cors";

// Load environment variables from .env file
dotenv.config({ path: './config/config.env' });

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Session Middleware with MongoStore
try {
  app.use(
    session({
      secret: process.env.SESSION_SECRET, // Ensure this is defined in .env
      resave: false, // Do not save session if it hasn't been modified
      saveUninitialized: false, // Do not create session until something is stored
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // MongoDB connection string from .env
        collectionName: 'sessions', // Name of the session collection in MongoDB
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false, // Only send cookies over HTTPS in production
        sameSite:  "none", // 'none' for cross-origin in production, 'lax' for local
        httpOnly: true,
      },
    })
  );
} catch (error) {
  console.error('Failed to connect to session store:', error);
}

// CORS Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Frontend URL from .env
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME, // Cloudinary name from .env
  api_key: process.env.CLOUDINARY_CLIENT_API, // Cloudinary API key from .env
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET, // Cloudinary API secret from .env
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
