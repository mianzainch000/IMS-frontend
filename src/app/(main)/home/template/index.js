"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/css/Home.module.css";
import Loader from "@/components/Loader";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const StatIcons = {
    Box: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
    Alert: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    Layers: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
    Users: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
};

const HomePage = () => {
    const showSnackbar = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        lowStockCount: 0,
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
            // PROFESSIONAL LOGIC: Alert only for 5 or less items
            const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 5);
            const recent = [...products].reverse().slice(0, 5);

            setDashboardData({
                totalProducts: products.length,
                lowStockCount: lowStockItems.length,
                totalCategories: catRes.data.length,
                recentUpdates: recent
            });
        } catch (error) {
            showSnackbar({ message: handleAxiosError(error).message, type: "error" });
        } finally {
            setLoading(false);
        }
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
            <div className={styles.welcomeSection}>
                <h1>Dashboard Overview</h1>
            </div>

            <div className={styles.statsGrid}>
                {stats.map((item, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.cardIcon} style={{ backgroundColor: `${item.color}15`, color: item.color }}>{item.icon}</div>
                        <div className={styles.cardInfo}><h3>{item.title}</h3><p>{item.value}</p></div>
                    </div>
                ))}
            </div>

            <div className={styles.recentSection}>
                <div className={styles.tableHeader}>
                    <h2>Recent Inventory Updates</h2>
                    <button className={styles.viewAllBtn} onClick={() => window.location.href = '/products'}>View All</button>
                </div>
                <table className={styles.table}>
                    <thead><tr><th>Product Name</th><th>Category</th><th>Quantity</th><th>Status</th></tr></thead>
                    <tbody>
                        {dashboardData.recentUpdates.length > 0 ? (
                            dashboardData.recentUpdates.map((p) => (
                                <tr key={p._id}>
                                    <td>{p.name}</td><td>{p.category}</td><td>{p.stock} pcs</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${p.stock > 5 ? styles.inStock : p.stock > 0 ? styles.lowStock : styles.outOfStock}`}>
                                            {p.stock > 5 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No products found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HomePage;