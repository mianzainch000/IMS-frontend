"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import styles from "@/css/Home.module.css";
import Loader from "@/components/Loader";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const StatIcons = {
    Box: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
    Alert: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    Layers: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
    Users: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
};

const HomePage = () => {
    const showSnackbar = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        lowStockCount: 0,
        lowStockItems: [],
        totalCategories: 0,
        recentUpdates: []
    });

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get("/products/api"),
                axios.get("/categories/api")
            ]);
            const products = prodRes.data;
            const alerts = products.filter(p => p.stock > 0 && p.stock <= 5);
            const recent = [...products].reverse().slice(0, 5);

            setDashboardData({
                totalProducts: products.length,
                lowStockCount: alerts.length,
                lowStockItems: alerts,
                totalCategories: catRes.data.length,
                recentUpdates: recent
            });
        } catch (error) {
            const { message } = handleAxiosError(error);
            showSnackbar({ message, type: "error" });
        } finally { setLoading(false); }
    };

    useEffect(() => { loadDashboardData(); }, []);

    const stats = [
        { title: "Total Products", value: dashboardData.totalProducts, icon: <StatIcons.Box />, color: "#2563eb" },
        { title: "Low Stock Alert", value: dashboardData.lowStockCount, icon: <StatIcons.Alert />, color: "#ef4444" },
        { title: "Total Categories", value: dashboardData.totalCategories, icon: <StatIcons.Layers />, color: "#10b981" },
        { title: "Users Active", value: "1", icon: <StatIcons.Users />, color: "#f59e0b" },
    ];

    return (
        <div className={styles.dashboardContainer}>
            {loading && <Loader />}

            {/* Header Section */}
            <div className={styles.welcomeSection}>
                <h1>
                    <span className={styles.desktopText}>Dashboard Overview</span>
                    <span className={styles.mobileText}>Overview</span>
                </h1>
                <p>Welcome back! Check your inventory status.</p>
            </div>

            {/* Notification / Alert List */}
            {dashboardData.lowStockItems.length > 0 && (
                <div className={styles.notificationArea}>
                    <div className={styles.alertHeader}>
                        <StatIcons.Alert />
                        <span>Inventory Alerts ({dashboardData.lowStockCount})</span>
                    </div>
                    <div className={styles.alertList}>
                        {dashboardData.lowStockItems.map((item) => (
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

            {/* Quick Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((item, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.cardIcon} style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                            {item.icon}
                        </div>
                        <div className={styles.cardInfo}>
                            <h3>{item.title}</h3>
                            <p>{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Updates Table */}
            <div className={styles.recentSection}>
                <div className={styles.tableHeader}>
                    <h2>
                        <span className={styles.desktopText}>Recent Updates</span>
                        <span className={styles.mobileText}>Updates</span>
                    </h2>
                    <Link href="/products" className={styles.viewAllBtn}>
                        <span className={styles.desktopText}>View All</span>
                        <span className={styles.mobileText}>View</span>
                    </Link>
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
                            {dashboardData.recentUpdates.map((product) => (
                                <tr key={product._id}>
                                    <td data-label="Name">
                                        <span className={styles.productName}>{product.name}</span>
                                    </td>
                                    <td data-label="Category">{product.category}</td>
                                    <td data-label="Quantity">{product.stock} pcs</td>
                                    <td data-label="Status">
                                        <span className={`${styles.statusBadge} ${product.stock > 5 ? styles.inStock : product.stock > 0 ? styles.lowStock : styles.outOfStock}`}>
                                            {product.stock > 5 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HomePage;