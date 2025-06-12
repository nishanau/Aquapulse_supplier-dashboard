'use client'
import React, { useState } from "react";
import styles from "./ordercard.module.css";
import Button from "../button/Button";
import { colors } from "@/utils/colors";

const OrderCard = () => {
  // Add state to track expanded/collapsed state
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.orderCard} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      {/* Header always visible */}
      <div className={styles.orderHeader} onClick={toggleExpand} >
        <div className={styles.orderSummary}>
          <p className={styles.orderId}>Order ID: 12345</p>
          <p className={styles.orderStatus}>Status: Pending</p>
          <p className={styles.orderDate}>Order Date: 2023-10-01</p>
        </div>
        <button 
          className={styles.expandToggle} 
          
          aria-label={isExpanded ? "Collapse order details" : "Expand order details"}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <>
          <div className={styles.orderDetails}>
            <div>
              <p>Customer Name: John Doe</p>
              <p>Customer Email: john.doe@example.com</p>
              <p>Delivery Address: 123 Main St, Springfield</p>
              <p>Contact: (123) 456-7890</p>
            </div>

            <div>
              <p>Total Amount: $150.00</p>
              <p>Payment Method: Credit Card</p>
              <p>Order Quantity: 3</p>
              <p>Expected Delivery: 2023-10-05</p>
            </div>
          </div>
          <div className={styles.orderButtons}>
            <Button background={colors.primary} name="Acknowledge" />
            <Button background={colors.secondary} name="Schedule Delivery" />
            <Button background={colors.success} name="Attach Invoice" />
          </div>
        </>
      )}
    </div>
  );
};

export default OrderCard;