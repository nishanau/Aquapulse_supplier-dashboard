"use client";
import React, { use, useState } from "react";
import { useEffect } from "react";
import OrderCard from "@/components/orderCard/OrderCard";
import styles from "./dashboard.module.css";
import { useOrders } from "@/utils/apiService";
import { FiPackage, FiCheckCircle, FiCalendar, FiCheck, FiFilter } from "react-icons/fi";
import useOrderStore from "@/store/useOrderStore"; // Zustand store for orders

const Page = () => {
  const { data: fetchedOrders, error, isLoading, mutate } = useOrders();

  // Use Zustand for state management
  const orders = useOrderStore((state) => state.orders);
  const setOrders = useOrderStore((state) => state.setOrders);
  const getOrderCounts = useOrderStore((state) => state.getOrderCounts);
  const getOrdersByStatus = useOrderStore((state) => state.getOrdersByStatus);

  // Track which tab is active
  const [activeTab, setActiveTab] = useState("new"); // default tab
  // Filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [volumeFilter, setVolumeFilter] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // Map each tab to the statuses it displays
  const tabs = {
    all: ["all"],
    new: ["placed"],
    acknowledged: ["acknowledged"],
    scheduled: ["scheduled"],
    completed: ["completed"],
  };

  // Update Zustand store when SWR data changes
  useEffect(() => {
    if (fetchedOrders) {
      setOrders(fetchedOrders);
    }
  }, [fetchedOrders, setOrders]);

  // Get order counts from Zustand
  const orderCounts = getOrderCounts();

  // Apply filters to orders
  const applyFilters = (ordersToFilter) => {
    if (!isFiltered) return ordersToFilter;

    return ordersToFilter.filter((order) => {
      let passesFilter = true;

      // Date range filter
      if (startDate && endDate) {
        const orderDate = new Date(order.orderDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59); // Set to end of day

        if (orderDate < start || orderDate > end) {
          passesFilter = false;
        }
      }

      // Volume filter
      if (passesFilter && volumeFilter) {
        const volume = order.quantity || 0;

        if (volumeFilter === "small" && (volume < 0 || volume > 1000)) {
          passesFilter = false;
        } else if (
          volumeFilter === "medium" &&
          (volume < 1001 || volume > 5000)
        ) {
          passesFilter = false;
        } else if (volumeFilter === "large" && volume < 5001) {
          passesFilter = false;
        }
      }

      return passesFilter;
    });
  };

  // Get base orders based on active tab
  const baseOrders =
    activeTab === "all" ? orders : getOrdersByStatus(tabs[activeTab]);

  // Apply filters to the base orders
  const filteredOrders = applyFilters(baseOrders);

  // Filter orders based on activeTab
  // const filteredOrders =
  //   activeTab === "all" ? orders : getOrdersByStatus(tabs[activeTab]);

  // Function to refresh orders data
  const refreshOrders = () => {
    mutate(); // Tell SWR to revalidate
  };

  // Handle filter application
  const handleApplyFilter = () => {
    // If filters are set, apply them and switch to "all" tab
    if (startDate || endDate || volumeFilter) {
      setIsFiltered(true);
      setActiveTab("all");
    }
  };

  // Clear all filters
  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setVolumeFilter("");
    setIsFiltered(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.dashboardHeader}>
        <h1>Dashboard</h1>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{orders?.length || 0}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{orderCounts.new}</span>
            <span className={styles.statLabel}>New</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{orderCounts.scheduled}</span>
            <span className={styles.statLabel}>Scheduled</span>
          </div>
        </div>
      </div>

      <div className={styles.dashboard}>
        {/* Navigation Tabs */}
        <div className={styles.dashboardNav}>
          <div
            className={`${styles.dashboardNavItem} ${
              activeTab === "all" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            <FiPackage className={styles.navIcon} />
            <span>All Orders</span>
            {orders.length > 0 && (
              <div className={styles.badge}>{orders.length}</div>
            )}
          </div>
          <div
            className={`${styles.dashboardNavItem} ${
              activeTab === "new" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("new")}
          >
            <FiPackage className={styles.navIcon} />
            <span>New Orders</span>
            {orderCounts.new > 0 && (
              <div className={styles.badge}>{orderCounts.new}</div>
            )}
          </div>
          <div
            className={`${styles.dashboardNavItem} ${
              activeTab === "acknowledged" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("acknowledged")}
          >
            <FiCheckCircle className={styles.navIcon} />
            <span>Acknowledged</span>
            {orderCounts.acknowledged > 0 && (
              <div className={styles.badge}>{orderCounts.acknowledged}</div>
            )}
          </div>
          <div
            className={`${styles.dashboardNavItem} ${
              activeTab === "scheduled" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("scheduled")}
          >
            <FiCalendar className={styles.navIcon} />
            <span>Scheduled</span>
            {orderCounts.scheduled > 0 && (
              <div className={styles.badge}>{orderCounts.scheduled}</div>
            )}
          </div>
          <div
            className={`${styles.dashboardNavItem} ${
              activeTab === "completed" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("completed")}
          >
            <FiCheck className={styles.navIcon} />
            <span>Completed</span>
            {orderCounts.completed > 0 && (
              <div className={styles.badge}>{orderCounts.completed}</div>
            )}
          </div>
        </div>

        <div className={styles.contentContainer}>
          {/* Main Content */}
          <div className={styles.dashboardContent}>
            <div className={styles.contentHeader}>
              <h2>
                {isFiltered && "Filtered Orders"}
                {!isFiltered && activeTab === "all" && "All Orders"}
                {!isFiltered && activeTab === "new" && "New Orders"}
                {!isFiltered &&
                  activeTab === "acknowledged" &&
                  "Acknowledged Orders"}
                {!isFiltered && activeTab === "scheduled" && "Scheduled Orders"}
                {!isFiltered && activeTab === "completed" && "Completed Orders"}
              </h2>
              <span className={styles.ordersCount}>
                <p>{filteredOrders?.length || 0} orders</p>
                {isFiltered && (
                  <button
                    className={styles.clearFilterBtn}
                    onClick={handleClearFilter}
                    title="Clear filters"
                  >
                    <FiFilter /> Clear
                  </button>
                )}
              </span>
            </div>

            <div className={styles.ordersList}>
              {isLoading && (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading orders...</p>
                </div>
              )}

              {!isLoading && error && (
                <div className={styles.errorState}>
                  <p>Unable to fetch orders. Please try again later.</p>
                  <button
                    onClick={refreshOrders}
                    className={styles.retryButton}
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isLoading && !error && filteredOrders?.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    {activeTab === "all" && <FiPackage />}
                    {activeTab === "new" && <FiPackage />}
                    {activeTab === "acknowledged" && <FiCheckCircle />}
                    {activeTab === "scheduled" && <FiCalendar />}
                    {activeTab === "completed" && <FiCheck />}
                  </div>
                  <p>No {activeTab === "all" ? "" : activeTab} orders found</p>
                </div>
              )}

              {!isLoading &&
                !error &&
                filteredOrders?.length > 0 &&
                filteredOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onOrderUpdated={refreshOrders}
                  />
                ))}
            </div>
          </div>

          {/* Filter Section */}
          <div className={styles.filter}>
            <h3>Filter Orders</h3>
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Date Range</label>
              <div className={styles.filterControls}>
                <input 
                  type="date" 
                  className={styles.dateInput} 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span>to</span>
                <input 
                  type="date" 
                  className={styles.dateInput} 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate} // Ensures end date is after start date
                />
              </div>
            </div>

            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Order Volume</label>
              <div className={styles.filterControls}>
                <select 
                  className={styles.selectInput}
                  value={volumeFilter}
                  onChange={(e) => setVolumeFilter(e.target.value)}
                >
                  <option value="">All volumes</option>
                  <option value="small">Small (0-1000L)</option>
                  <option value="medium">Medium (1001-5000L)</option>
                  <option value="large">Large (5001L+)</option>
                </select>
              </div>
            </div>

            <button 
              className={styles.applyFilter}
              onClick={handleApplyFilter}
              disabled={!startDate && !endDate && !volumeFilter}
            >
              Apply Filters
            </button>
            <button 
              className={styles.clearFilter}
              onClick={handleClearFilter}
              disabled={!isFiltered && !startDate && !endDate && !volumeFilter}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
