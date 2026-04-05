"use client";
import styles from "@/css/Home.module.css";

// --- Static SVG Icons for Dashboard Stats ---
const StatIcons = {
    Box: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    ),
    Alert: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    Layers: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
    ),
    Users: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ),
};

const HomePage = () => {
    // Static data for UI representation
    const stats = [
        { title: "Total Products", value: "1,240", icon: <StatIcons.Box />, color: "#2563eb" },
        { title: "Low Stock Items", value: "12", icon: <StatIcons.Alert />, color: "#ef4444" },
        { title: "Total Categories", value: "45", icon: <StatIcons.Layers />, color: "#10b981" },
        { title: "Users Active", value: "8", icon: <StatIcons.Users />, color: "#f59e0b" },
    ];

    const recentUpdates = [
        { id: 1, name: "Gaming Mouse", category: "Electronics", qty: 45, status: "In Stock", date: "05 Apr 2026" },
        { id: 2, name: "Mechanical Keyboard", category: "Electronics", qty: 2, status: "Low Stock", date: "04 Apr 2026" },
        { id: 3, name: "Office Chair", category: "Furniture", qty: 12, status: "In Stock", date: "04 Apr 2026" },
        { id: 4, name: "USB-C Cable", category: "Accessories", qty: 0, status: "Out of Stock", date: "03 Apr 2026" },
    ];

    return (
        <div className={styles.dashboardContainer}>
            {/* Header Section */}
            <div className={styles.welcomeSection}>
                <h1>Dashboard Overview</h1>
                <p>Welcome back! Here&apos;s what&apos;s happening with your inventory today.</p>
            </div>

            {/* Stats Cards Grid */}
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

            {/* Recent Activity Table Section */}
            <div className={styles.recentSection}>
                <div className={styles.tableHeader}>
                    <h2>Recent Inventory Updates</h2>
                    <button className={styles.viewAllBtn}>View All</button>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Date Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUpdates.map((product) => (
                                <tr key={product.id}>
                                    <td className={styles.productName}>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.qty}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${product.status === "In Stock" ? styles.inStock :
                                                product.status === "Low Stock" ? styles.lowStock : styles.outOfStock
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td>{product.date}</td>
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