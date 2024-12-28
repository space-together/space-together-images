// src/index.ts

import express, { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API to upload an image
app.post('/upload', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { folder = 'default' } = req.body; // Accept folder as a part of the request body
    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          throw error;
        }
        res.status(200).json({
          message: 'Image uploaded successfully',
          uri: result?.secure_url,
          folder: result?.folder,
        });
      }
    );
    req.file.stream.pipe(uploadResult); // Pipe the uploaded file stream to Cloudinary
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
