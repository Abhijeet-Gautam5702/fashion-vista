/*
    UTILITY TO UPLOAD IMAGES TO CLOUDINARY

    STEP-1: Obtain images from the client using Multer library and store it on the server (in `/public/temp` directory)
    STEP-2: Upload the images stored on the server to Cloudinary and obtain the Cloudinary-URLs 
    STEP-3: Store these Cloudinary-links in the database
    STEP-4: Delete the image files stored on the server
*/

import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

const uploadImageToCloudinary = async (imageFilePathInServer) => {
  try {
    if (!imageFilePathInServer) {
      console.log(`IMAGE UPLOAD FAILED || LOCAL PATH TO IMAGE NOT PROVIDED`);
      return null; // Return null here and handle this in the controller method
    }
    const response = await cloudinary.uploader.upload(imageFilePathInServer);
    return response;
  } catch (error) {
    console.log(`IMAGE UPLOAD FAILED || ERROR = ${error.message}`);
    throw error; // Error will be thrown by this method and it will be catched by the asyncController method.
  } finally {
    // delete the image file stored locally in the server
    fs.unlinkSync(imageFilePathInServer);
  }
};

export default uploadImageToCloudinary;
