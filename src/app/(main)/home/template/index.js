"use client";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader";
import styles from "@/css/Home.module.css";
import { useSnackbar } from "@/components/Snackbar";
import { useState, useEffect, useMemo } from "react";
import { handleGlobalLogout } from "@/utils/autoLogout";
import { useSearchParams, useRouter } from "next/navigation";
import handleAxiosError from "@/components/HandleAxiosError";
import PermissionWrapper from "@/components/PermissionWrapper";

const StatIcons = {
  Box: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  Alert: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Layers: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
  ),
  Users: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
};

const HomePage = () => {
  const showSnackbar = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    lowStockItems: [],
    totalCategories: 0,
    totalUsers: 0,
    recentUpdates: [],
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, userRes] = await Promise.all([
        axios.get("/products/api"),
        axios.get("/categories/api"),
        axios.get("/users/api"),
      ]);

      const products = prodRes.data;
      const categories = catRes.data;
      const usersList = userRes.data;

      const alerts = products.filter((p) => p.stock > 0 && p.stock <= 5);
      const recent = [...products].reverse().slice(0, 5);
      const activeUsersCount = usersList.filter(
        (u) => u.status === "Active",
      ).length;

      setDashboardData({
        totalProducts: products.length,
        lowStockCount: alerts.length,
        lowStockItems: alerts,
        totalCategories: categories.length,
        totalUsers: activeUsersCount,
        recentUpdates: recent,
      });

      const event = new CustomEvent("updateCartBadge", {
        detail: alerts.length,
      });
      window.dispatchEvent(event);
    } catch (error) {
      if (error.response?.status === 403) {
        handleGlobalLogout();
      } else {
        const { message } = handleAxiosError(error);
        showSnackbar({ message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const filteredRecentUpdates = useMemo(() => {
    return dashboardData.recentUpdates.filter(
      (p) =>
        p.name.toLowerCase().startsWith(searchQuery) ||
        p.category.toLowerCase().startsWith(searchQuery),
    );
  }, [dashboardData.recentUpdates, searchQuery]);

  const filteredAlerts = useMemo(() => {
    return dashboardData.lowStockItems.filter((p) =>
      p.name.toLowerCase().startsWith(searchQuery),
    );
  }, [dashboardData.lowStockItems, searchQuery]);

  const stats = [
    {
      title: "Total Products",
      value: dashboardData.totalProducts,
      icon: <StatIcons.Box />,
      color: "#2563eb",
    },
    {
      title: "Low Stock Alert",
      value: dashboardData.lowStockCount,
      icon: <StatIcons.Alert />,
      color: "#ef4444",
    },
    {
      title: "Total Categories",
      value: dashboardData.totalCategories,
      icon: <StatIcons.Layers />,
      color: "#10b981",
    },
    {
      title: "Users Active",
      value: dashboardData.totalUsers,
      icon: <StatIcons.Users />,
      color: "#f59e0b",
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {loading && <Loader />}

      <div className={styles.welcomeSection}>
        <h1>
          <span className={styles.desktopText}>Dashboard Overview</span>
          <span className={styles.mobileText}>Overview</span>
        </h1>
        <p>Welcome back! Check your inventory status.</p>
      </div>

      {}
      {filteredAlerts.length > 0 && (
        <div className={styles.notificationArea}>
          <div className={styles.alertHeader}>
            <StatIcons.Alert />
            <span>Inventory Alerts ({filteredAlerts.length})</span>
          </div>
          <div className={styles.alertList}>
            {filteredAlerts.map((item) => (
              <div key={item._id} className={styles.alertItem}>
                <p className={styles.alertText}>
                  <strong>{item.name}</strong>
                  <span>is low: {item.stock} left</span>
                </p>
                <Link href="/products" className={styles.restockBtn}>
                  Restock
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      <div className={styles.statsGrid}>
        {stats.map((item, index) => (
          <div key={index} className={styles.card}>
            <div
              className={styles.cardIcon}
              style={{ backgroundColor: `${item.color}15`, color: item.color }}
            >
              {item.icon}
            </div>
            <div className={styles.cardInfo}>
              <h3>{item.title}</h3>
              <p>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {}
      <div className={styles.recentSection}>
        <div className={styles.tableHeader}>
          <h2>Recent Updates</h2>
          <PermissionWrapper allowedRoles={["Admin", "Editor"]}>
            <Link href="/products" className={styles.viewAllBtn}>
              View All
            </Link>
          </PermissionWrapper>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecentUpdates.length > 0 ? (
                filteredRecentUpdates.map((product) => (
                  <tr key={product._id}>
                    <td data-label="Name">{product.name}</td>
                    <td data-label="Category">{product.category}</td>
                    <td data-label="Quantity">{product.stock} pcs</td>
                    <td data-label="Status">
                      <span
                        className={`${styles.statusBadge} ${product.stock > 5 ? styles.inStock : product.stock > 0 ? styles.lowStock : styles.outOfStock}`}
                      >
                        {product.stock > 5
                          ? "In Stock"
                          : product.stock > 0
                            ? "Low Stock"
                            : "Out"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#666",
                    }}
                  >
                    {searchQuery
                      ? `No matches found for "${searchQuery}"`
                      : "No recent updates."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
