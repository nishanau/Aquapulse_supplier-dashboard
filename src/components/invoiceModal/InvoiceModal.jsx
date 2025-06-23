import { useState, useRef } from "react";
import { FiUpload, FiX, FiFile, FiDownload } from "react-icons/fi";
import { uploadFile, deleteIfExists } from "@/utils/storageService";
import styles from "./invoiceModal.module.css";
import { useAuthStore } from "@/store/useAuthStore";

const InvoiceModal = ({ order, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  console.log("Order Number:", order);


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a PDF, JPEG, or PNG file");
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Delete existing invoice file if present
      if (order.invoice && order.invoice.filePath) {
        await deleteIfExists(order.invoice.filePath);
      }

      // Upload file to S3 with invoice path
      const fileData = await uploadFile(
        selectedFile,
        `invoices/${user.company}/${order.orderNumber}`,
        true
      );

      // Call the success handler with file data
      if (onUploadSuccess) {
        onUploadSuccess(fileData);
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error uploading invoice:", error);
      setError("Failed to upload invoice. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Upload Invoice</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.modalContent}>
          <p>Upload invoice for Order #{order.orderNumber || order._id}</p>

          <div className={styles.uploadContainer}>
            {!selectedFile ? (
              <div
                className={styles.dropZone}
                onClick={() => fileInputRef.current.click()}
              >
                <FiUpload className={styles.uploadIcon} />
                <p>Click to select an invoice file</p>
                <span className={styles.supportedFormats}>
                  Supported formats: PDF, JPG, PNG (max 5MB)
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  hidden
                />
              </div>
            ) : (
              <div className={styles.selectedFile}>
                <FiFile className={styles.fileIcon} />
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{selectedFile.name}</span>
                  <span className={styles.fileSize}>
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => setSelectedFile(null)}
                >
                  <FiX />
                </button>
              </div>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {order.invoice && (
            <div className={styles.currentInvoice}>
              <p>Current invoice:</p>
              <div className={styles.invoiceFile}>
                <FiFile className={styles.fileIcon} />
                <span>{order.invoice.fileName}</span>
                <small>(Will be replaced)</small>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.uploadButton}
            disabled={!selectedFile || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? "Uploading..." : "Upload Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
