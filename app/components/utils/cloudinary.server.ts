// app/utils/cloudinary.server.ts
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "uploads" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          if (!result || !result.secure_url) {
            return reject(
              new Error("Cloudinary upload failed: No URL returned.")
            );
          }
          resolve(result);
        }
      );
      Readable.from(buffer).pipe(uploadStream);
    }) as Promise<{ secure_url: string }>;
  } catch (error) {
    console.error("Error preparing file for Cloudinary upload:", error);
    throw new Error("Failed to upload file to Cloudinary.");
  }
}
