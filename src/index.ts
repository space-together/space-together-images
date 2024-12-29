// src/index.ts

import express, { Request, Response } from 'express';
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

// Middleware to parse JSON body
app.use(express.json());

// Type Definitions
interface Image {
  image: string;
}

interface ImageRespondError {
  message: string;
  status: number;
}

interface ImageRespondSuccess {
  message: string;
  uri: string;
  public_id: string;
  status: number;
}

// Endpoint to save avatars only
app.post('/upload/avatar', async (req: Request, res: Response): Promise<void> => {
  try {
    const { image }: Image = req.body;

    if (!image) {
      const errorResponse: ImageRespondError = {
        message: 'Image data is required in base64 format',
        status: 400,
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Upload image to Cloudinary under the 'avatars' folder
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: 'avatars',
    });

    const successResponse: ImageRespondSuccess = {
      message: 'Avatar uploaded successfully',
      uri: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      status: 200,
    };

    res.status(200).json(successResponse);
  } catch (error: any) {
    console.error(error);
    const errorResponse: ImageRespondError = {
      message: error.message || 'An error occurred while uploading the avatar',
      status: 500,
    };
    res.status(500).json(errorResponse);
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
