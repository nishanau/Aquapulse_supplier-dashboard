import React from "react";
import OrderCard from "@/components/orderCard/OrderCard";
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
        <div className={styles.dashboardContent}>
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
        </div>
      </div>
    </div>
  );
};

export default Page;
