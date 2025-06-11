import React from "react";
import styles from "./dashboard.module.css"; // Assuming you have a CSS module for styling
const Page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.filter}>filter</div>
      <div className={styles.dashboard}>
        <div className={styles.dashboardNav}>
          <div className={styles.dashboardNavItem}>New Orders</div>
          <div className={styles.dashboardNavItem}>Acknowledged Orders</div>
          <div className={styles.dashboardNavItem}>Scheduled Orders</div>
          <div className={styles.dashboardNavItem}>Completed Orders</div>
        </div>
        <div>
          <div className={styles.dashboardContent}>
            <div className={styles.orderCard}>
              <div className={styles.orderDetails}>
                <div>
                  <p>Order ID: 12345</p>
                  <p>Customer Name: John Doe</p>
                  <p>Customer Email: john.doe@example.com</p>
                  <p>Delivery Address: 123 Main St, Springfield</p>
                  <p>Contact: (123) 456-7890</p>
                </div>

                <div>
                  <p>Status: Pending</p>
                  <p>Order Date: 2023-10-01</p>
                  <p>Total Amount: $150.00</p>
                  <p>Payment Method: Credit Card</p>
                  <p>Items Ordered: 3</p>
                  <p>Expected Delivery: 2023-10-05</p>
                </div>
              </div>
              <div className={styles.orderButtons}>
                <button className={styles.orderButton}>Acknowledge</button>
                <button className={styles.orderButton}>
                  Schedule Delivery
                </button>
                <button className={styles.orderButton}>Attach Invoice</button>
              </div>
            </div>
          </div>
          <div className={styles.dashboardContent}>
            <div className={styles.orderCard}>
              <div className={styles.orderDetails}>
                <div>
                  <p>Order ID: 12345</p>
                  <p>Customer Name: John Doe</p>
                  <p>Customer Email: john.doe@example.com</p>
                  <p>Delivery Address: 123 Main St, Springfield</p>
                  <p>Contact: (123) 456-7890</p>
                </div>

                <div>
                  <p>Status: Pending</p>
                  <p>Order Date: 2023-10-01</p>
                  <p>Total Amount: $150.00</p>
                  <p>Payment Method: Credit Card</p>
                  <p>Items Ordered: 3</p>
                  <p>Expected Delivery: 2023-10-05</p>
                </div>
              </div>
              <div className={styles.orderButtons}>
                <button className={styles.orderButton}>Acknowledge</button>
                <button className={styles.orderButton}>
                  Schedule Delivery
                </button>
                <button className={styles.orderButton}>Attach Invoice</button>
              </div>
            </div>
          </div>
          <div className={styles.dashboardContent}>
            <div className={styles.orderCard}>
              <div className={styles.orderDetails}>
                <div>
                  <p>Order ID: 12345</p>
                  <p>Customer Name: John Doe</p>
                  <p>Customer Email: john.doe@example.com</p>
                  <p>Delivery Address: 123 Main St, Springfield</p>
                  <p>Contact: (123) 456-7890</p>
                </div>

                <div>
                  <p>Status: Pending</p>
                  <p>Order Date: 2023-10-01</p>
                  <p>Total Amount: $150.00</p>
                  <p>Payment Method: Credit Card</p>
                  <p>Items Ordered: 3</p>
                  <p>Expected Delivery: 2023-10-05</p>
                </div>
              </div>
              <div className={styles.orderButtons}>
                <button className={styles.orderButton}>Acknowledge</button>
                <button className={styles.orderButton}>
                  Schedule Delivery
                </button>
                <button className={styles.orderButton}>Attach Invoice</button>
              </div>
            </div>
          </div>
          <div className={styles.dashboardContent}>
            <div className={styles.orderCard}>
              <div className={styles.orderDetails}>
                <div>
                  <p>Order ID: 12345</p>
                  <p>Customer Name: John Doe</p>
                  <p>Customer Email: john.doe@example.com</p>
                  <p>Delivery Address: 123 Main St, Springfield</p>
                  <p>Contact: (123) 456-7890</p>
                </div>

                <div>
                  <p>Status: Pending</p>
                  <p>Order Date: 2023-10-01</p>
                  <p>Total Amount: $150.00</p>
                  <p>Payment Method: Credit Card</p>
                  <p>Items Ordered: 3</p>
                  <p>Expected Delivery: 2023-10-05</p>
                </div>
              </div>
              <div className={styles.orderButtons}>
                <button className={styles.orderButton}>Acknowledge</button>
                <button className={styles.orderButton}>
                  Schedule Delivery
                </button>
                <button className={styles.orderButton}>Attach Invoice</button>
              </div>
            </div>
          </div>
                    <div className={styles.dashboardContent}>
            <div className={styles.orderCard}>
              <div className={styles.orderDetails}>
                <div>
                  <p>Order ID: 12345</p>
                  <p>Customer Name: John Doe</p>
                  <p>Customer Email: john.doe@example.com</p>
                  <p>Delivery Address: 123 Main St, Springfield</p>
                  <p>Contact: (123) 456-7890</p>
                </div>

                <div>
                  <p>Status: Pending</p>
                  <p>Order Date: 2023-10-01</p>
                  <p>Total Amount: $150.00</p>
                  <p>Payment Method: Credit Card</p>
                  <p>Items Ordered: 3</p>
                  <p>Expected Delivery: 2023-10-05</p>
                </div>
              </div>
              <div className={styles.orderButtons}>
                <button className={styles.orderButton}>Acknowledge</button>
                <button className={styles.orderButton}>
                  Schedule Delivery
                </button>
                <button className={styles.orderButton}>Attach Invoice</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
