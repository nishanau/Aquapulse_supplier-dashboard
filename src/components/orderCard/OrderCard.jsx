import React, { useState, useEffect } from "react";
import styles from "./ordercard.module.css";
import formatAustralianDate from "@/utils/dateFormatter";
import {
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMail,
  FiMapPin,
  FiPhone,
  FiDollarSign,
  FiCreditCard,
  FiPackage,
  FiCalendar,
  FiCheck,
  FiFile,
  FiX,
  FiFileText,
} from "react-icons/fi";
import { useToast } from "@/provider/ToastProvider";
import useOrderStore from "@/store/useOrderStore"; // Zustand store for orders
import InvoiceModal from "@/components/invoiceModal/InvoiceModal"; // Invoice upload modal
import InvoiceDisplay from "../invoiceDisplay/InvoiceDisplay";

const OrderCard = ({ order, onOrderUpdated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const { showToast } = useToast();
  const [selectedTime, setSelectedTime] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const hasValidInvoice =
    order.invoice && order.invoice.fileName && order.invoice.filePath;
  const [invoiceData, setInvoiceData] = useState(
    hasValidInvoice ? order.invoice : null
  );

  // Check if invoice has required properties to be considered "real"

  // Get updateOrder from Zustand
  const updateOrder = useOrderStore((state) => state.updateOrder);

  // Handle invoice upload success
  const handleInvoiceUploadSuccess = async (fileData) => {
    try {
      // Update order with invoice data in your backend
      await updateOrder(order._id, {
        invoice: fileData,
      });

      // Update local state with direct fileData
      setInvoiceData(fileData);

      // Show success message
      showToast("Invoice uploaded successfully", "success");

      // Notify parent component of the update
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (error) {
      console.error("Error updating order with invoice:", error);
      showToast("Failed to upload invoice", "error");
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Map status to color class
  const getStatusClass = (status) => {
    switch (status) {
      case "placed":
        return styles.statusNew;
      case "acknowledged":
        return styles.statusAcknowledged;
      case "scheduled":
        return styles.statusScheduled;
      case "completed":
        return styles.statusCompleted;
      default:
        return "";
    }
  };
  const handleAcknowledge = async (orderId) => {
    const { success } = await updateOrder(orderId, { status: "acknowledged" });

    if (success) {
      showToast("Order acknowledged successfully", "success");

      // Call the refresh function from parent to trigger SWR revalidation
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } else {
      showToast("Failed to acknowledge order", "error");
    }
  };

  const handleScheduleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;

    // Combine date and time into a single ISO string
    const scheduledDateTime = `${selectedDate}T${selectedTime}:00`;

    const { success } = await updateOrder(order._id, {
      status: "scheduled",
      scheduledDeliveryDate: scheduledDateTime,
    });

    if (success) {
      showToast("Delivery scheduled successfully", "success");
      closeScheduleModal();
      setSelectedDate("");
      setSelectedTime("");

      // Call the refresh function from parent
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } else {
      showToast("Failed to schedule delivery", "error");
    }
  };

  const openInvoiceModal = () => {
    document.body.classList.add("modal-open");

    setShowInvoiceModal(true);
  };

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false);
    document.body.classList.remove("modal-open");
  };

  // New function to open the schedule modal
  const openScheduleModal = () => {
    setShowScheduleModal(true);
    document.body.classList.add("modal-open");
  };

  // New function to close the schedule modal
  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    document.body.classList.remove("modal-open");
  };

  return (
    <div
      className={`${styles.orderCard} ${
        isExpanded ? styles.expanded : styles.collapsed
      }`}
    >
      <div className={styles.orderHeader} onClick={toggleExpand}>
        <div className={styles.orderSummary}>
          <div className={styles.primaryInfo}>
            <p className={styles.orderId}>
              Order #{order.orderNumber || "N/A"}
            </p>
            <div
              className={`${styles.orderStatusBadge} ${getStatusClass(
                order.status
              )}`}
            >
              {order.status}
            </div>
          </div>
          <div className={styles.secondaryInfo}>
            <p className={styles.orderDate}>
              <FiCalendar className={styles.infoIcon} />
              {formatAustralianDate(order.orderDate)}
            </p>
            <p className={styles.orderAmount}>
              <FiDollarSign className={styles.infoIcon} />
              {order.price || "N/A"}
            </p>
          </div>
        </div>
        <button
          className={styles.expandToggle}
          aria-label={
            isExpanded ? "Collapse order details" : "Expand order details"
          }
        >
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.orderDetails}>
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionTitle}>Customer Information</h3>
              <div className={styles.detailItem}>
                <FiUser className={styles.detailIcon} />
                <span className={styles.detailLabel}>Name:</span>
                <span className={styles.detailValue}>
                  {order.customer?.firstName} {order.customer?.lastName}
                </span>
              </div>
              <div className={styles.detailItem}>
                <FiMail className={styles.detailIcon} />
                <span className={styles.detailLabel}>Email:</span>
                <span className={styles.detailValue}>
                  {order.customer?.email || "—"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <FiMapPin className={styles.detailIcon} />
                <span className={styles.detailLabel}>Address:</span>
                <span className={styles.detailValue}>
                  {order.customer?.address?.street || "—"}
                  {order.customer?.address?.street &&
                    order.customer?.address?.city &&
                    ", "}
                  {order.customer?.address?.city || ""}
                  {(order.customer?.address?.street ||
                    order.customer?.address?.city) &&
                    order.customer?.address?.postalCode &&
                    ", "}
                  {order.customer?.address?.postalCode || ""}
                </span>
              </div>
              <div className={styles.detailItem}>
                <FiPhone className={styles.detailIcon} />
                <span className={styles.detailLabel}>Contact:</span>
                <span className={styles.detailValue}>
                  {order.customer?.phoneNumber || "—"}
                </span>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h3 className={styles.sectionTitle}>Order Details</h3>
              <div className={styles.detailItem}>
                <FiDollarSign className={styles.detailIcon} />
                <span className={styles.detailLabel}>Total:</span>
                <span className={styles.detailValue}>
                  {order.price || "N/A"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <FiCreditCard className={styles.detailIcon} />
                <span className={styles.detailLabel}>Payment:</span>
                <span className={styles.detailValue}>
                  {order.paymentMethod || "N/A"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <FiPackage className={styles.detailIcon} />
                <span className={styles.detailLabel}>Quantity:</span>
                <span className={styles.detailValue}>
                  {order.quantity || "N/A"} L
                </span>
              </div>
              <div className={styles.detailItem}>
                <FiCalendar className={styles.detailIcon} />
                <span className={styles.detailLabel}>Requested:</span>
                <span className={styles.detailValue}>
                  {formatAustralianDate(order.requestedDeliveryDate)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <FiCalendar className={styles.detailIcon} />
                <span className={styles.detailLabel}>Expected Delivery:</span>
                <span className={styles.detailValue}>
                  {formatAustralianDate(order.scheduledDeliveryDate)}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.orderActions}>
            <div className={styles.actionButtons}>
              {order.status === "placed" && (
                <button
                  className={`${styles.actionButton} ${styles.acknowledgeButton}`}
                  onClick={() => handleAcknowledge(order._id)}
                >
                  <FiCheck className={styles.buttonIcon} />
                  <span>Acknowledge</span>
                </button>
              )}
              {order.status === "acknowledged" && (
                <button
                  className={`${styles.actionButton} ${styles.scheduleButton}`}
                  onClick={openScheduleModal}
                >
                  <FiCalendar className={styles.buttonIcon} />
                  <span>Schedule Delivery</span>
                </button>
              )}

              <button
                className={`${styles.actionButton} ${styles.invoiceButton}`}
                onClick={openInvoiceModal}
              >
                <FiFile className={styles.buttonIcon} />
                {invoiceData ? (
                  <span>Replace Invoice</span>
                ) : (
                  <span>Attach Invoice</span>
                )}
              </button>
            </div>

            <div className={styles.invoiceSection}>
              {invoiceData && (
                <>
                  <InvoiceDisplay invoice={invoiceData} />
                </>
              )}
            </div>
          </div>
          {showInvoiceModal && (
            <InvoiceModal
              order={order}
              onClose={closeInvoiceModal}
              onUploadSuccess={handleInvoiceUploadSuccess}
            />
          )}
        </div>
      )}

      {/* Schedule Delivery Modal */}
      {/* Schedule Delivery Modal */}
      {showScheduleModal && (
        <div className={styles.modalOverlay} onClick={closeScheduleModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Schedule Delivery</h3>
              <button
                className={styles.closeButton}
                onClick={closeScheduleModal}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>

            <div className={styles.modalContent}>
              <p>
                Please select delivery date and time for order #
                {order.orderNumber}:
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="deliveryTime">Delivery Time:</label>
                <input
                  id="deliveryTime"
                  type="time"
                  className={styles.timePicker}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  min="08:00"
                  max="18:00"
                />
                <small
                  style={{ margin: "4px", marginLeft: "12px" }}
                  className={styles.timeNote}
                >
                  HH : MM AM/PM
                </small>
              </div>
              <br />

              <div className={styles.dateTimeContainer}>
                <div className={styles.formGroup}>
                  <label htmlFor="deliveryDate">Delivery Date:</label>
                  <input
                    id="deliveryDate"
                    type="date"
                    className={styles.datePicker}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Prevents selecting past dates
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={closeScheduleModal}
              >
                Cancel
              </button>
              <button
                className={`${styles.confirmButton} ${
                  !selectedDate || !selectedTime ? styles.disabled : ""
                }`}
                onClick={handleScheduleSubmit}
                disabled={!selectedDate || !selectedTime}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
