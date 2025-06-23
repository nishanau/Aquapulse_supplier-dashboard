import { useState } from "react";
import { FiFile, FiDownload, FiX } from "react-icons/fi";
import { getFileUrl } from "@/utils/storageService";
import styles from "./invoiceDisplay.module.css";

const InvoiceDisplay = ({ invoice }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDownload = async () => {
    try {
      let url;

      // Get the appropriate URL (either direct or refreshed)
      if (!invoice.isPublic) {
        url = await getFileUrl(invoice.filePath);
      } else {
        url = invoice.downloadURL;
      }

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;

      // Set the download attribute with the original filename
      link.setAttribute("download", invoice.fileName);

      // Append to the document, click it, then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className={styles.invoiceDisplay} onClick={handleDownload}>
      <div className={styles.invoiceInfo}>
        <FiFile className={styles.fileIcon} />
        <div className={styles.fileDetails}>
          <span className={styles.fileName}>{invoice.fileName}</span>

          <span className={styles.fileDate}>
            {new Date(invoice.uploadedAt).toLocaleDateString()}
          </span>
        </div>

        <FiDownload className={styles.downloadIcon} />
      </div>
    </div>
  );
};

export default InvoiceDisplay;
