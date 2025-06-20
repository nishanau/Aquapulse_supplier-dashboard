'use client'
import React from "react";
import OrderCard from "@/components/orderCard/OrderCard";
import styles from "./dashboard.module.css";
import { useOrders } from "@/utils/apiService";

const Page = () => {
  const { data, error, isLoading } = useOrders();
  return (


    <div className={styles.container}>

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
        <div className={styles.filter}><p>filter</p></div>
      </div>
    </div>
  );
};

export default Page;
