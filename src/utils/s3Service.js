import s3Client from "./s3";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;

/**
 * Upload a file to AWS S3 with improved directory structure
 * @param {File} file - The file to upload
 * @param {string} fileType - Type of file ("logo" or "invoice")
 * @param {Object} metadata - Additional metadata (company, orderNumber, etc.)
 * @param {boolean} makePublic - Whether to make the file publicly accessible
 * @returns {Promise<Object>} File metadata including download URL
 */
export const uploadFile = async (file, fileType, metadata, makePublic = false) => {
  try {
    if (!file) throw new Error("No file provided");
    if (!metadata.company) throw new Error("Company name is required for file organization");
    
    // Sanitize company name for use in paths
    const sanitizedCompany = metadata.company.replace(/\s+/g, "-").toLowerCase();
    
    // Create a unique filename with timestamp
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    
    // Determine the appropriate path based on file type
    let filePath;
    switch(fileType.toLowerCase()) {
      case 'logo':
        // Logos: public/supplier/[company]/logo/
        filePath = `public/supplier/${sanitizedCompany}/logo/${uniqueFilename}`;
        makePublic = true; // Logos should always be public
        break;
      case 'invoice':
        // Invoices: public/supplier/[company]/invoices/[orderNumber]/
        if (!metadata.orderNumber) throw new Error("Order number is required for invoice uploads");
        filePath = `public/supplier/${sanitizedCompany}/invoices/${metadata.orderNumber}/${uniqueFilename}`;
        break;
      default:
        // Generic uploads with type as subfolder
        filePath = `public/supplier/${sanitizedCompany}/${fileType.toLowerCase()}/${uniqueFilename}`;
    }

    // Convert file to binary data
    const fileData = await file.arrayBuffer();

    // Create upload command
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
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
      downloadURL = `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${filePath}`;
    } else {
      // Pre-signed URL for private files (expires in 1 hour)
      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
      });
      downloadURL = await getSignedUrl(s3Client, getCommand, {
        expiresIn: 3600,
      });
    }

    // Return file metadata
    return {
      fileName: file.name,
      filePath: filePath,
      contentType: file.type,
      size: file.size,
      downloadURL: downloadURL,
      isPublic: makePublic,
      uploadedAt: new Date().toISOString(),
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
