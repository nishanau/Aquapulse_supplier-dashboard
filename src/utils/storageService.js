import s3Client from "./s3";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;

/**
 * Upload a file to AWS S3
 * @param {File} file - The file to upload
 * @param {string} path - Path in S3 (e.g., "invoices")
 * @param {boolean} makePublic - Whether to make the file publicly accessible
 * @returns {Promise<Object>} File metadata including download URL
 */
export const uploadFile = async (file, path, makePublic = false) => {
  try {
    // Create a unique key for the file
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    // If makePublic is true, ensure the path starts with "public/"
    let key;
    if (makePublic) {
      // Ensure path starts with "public/"
      key = path.startsWith("public/")
        ? `${path}/${fileName}`
        : `public/${path}/${fileName}`;
    } else {
      key = `${path}/${fileName}`;
    }

    // Convert file to binary data
    const fileData = await file.arrayBuffer();

    // Create upload command - only add ACL for public files
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: Buffer.from(fileData),
      ContentType: file.type,
      ContentDisposition: `attachment; filename="${file.name}"`,
      ...(makePublic && { ACL: "public-read" }),
    });

    await s3Client.send(uploadCommand);

    // Create URL based on whether the file is public or not
    let downloadURL;
    if (makePublic) {
      // Direct URL for public files
      downloadURL = `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
    } else {
      // Pre-signed URL for private files
      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });
      downloadURL = await getSignedUrl(s3Client, getCommand, {
        expiresIn: 3600,
      });
    }

    // Return file metadata
    return {
      fileName: file.name,
      filePath: key,
      downloadURL,
      contentType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      isPublic: makePublic,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

/**
 * Get a temporary download URL for a file
 * @param {string} key - The S3 object key
 * @returns {Promise<string>} The pre-signed download URL
 */
export const getFileUrl = async (key) => {
  try {
    // Check if the file is in the public folder
    if (key.startsWith("public/")) {
      // Return direct URL for public files
      return `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
    } else {
      // Generate pre-signed URL for private files
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    }
  } catch (error) {
    console.error("Error generating URL:", error);
    throw error;
  }
};

/**
 * Delete a file from S3
 * @param {string} key - The S3 object key
 * @returns {Promise<{success: boolean, error?: Error}>}
 */
export const deleteFile = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return { success: false, error };
  }
};

/**
 * Delete a file from S3 if it exists
 * @param {string} key - The S3 object key to delete
 * @returns {Promise<boolean>} Whether the file was deleted
 */
export const deleteIfExists = async (key) => {
  if (!key) return false;

  try {
    const result = await deleteFile(key);
    return result.success;
  } catch (error) {
    console.error("Error deleting existing file:", error);
    return false;
  }
};
