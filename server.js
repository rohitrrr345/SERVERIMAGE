import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cloudinary from "cloudinary";
import MongoStore from 'connect-mongo';
import cors from "cors";

dotenv.config({ path: './config/config.env' });

// Connect to MongoDB
connectDB();

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

try {
  app.use(
    session({
      secret: process.env.SESSION_SECRET, 
      resave: false, 
      saveUninitialized: false, 
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions', 
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,  
              httpOnly: true,

      },
    })
  );
} catch (error) {
  console.error('Failed to connect to session store:', error);
}

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
})

// Routes
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
