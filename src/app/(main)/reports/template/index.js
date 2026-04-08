"use client";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Loader from "@/components/Loader";
import styles from "@/css/ProfitLoss.module.css";

const ProfitLossPage = () => {
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [viewMode, setViewMode] = useState("amount");
    const [data, setData] = useState({ stats: {}, recentSales: [] });

    const fetchAnalytics = async (currentFilter) => {
        setLoading(true);
        try {
            const res = await axios.get(`/reports/api?filter=${currentFilter}`);
            setData(res.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics(filter);
    }, [filter]);

    const totalProfit = data.stats.totalProfit || 0;
    const totalCost = data.stats.totalCost || 0;
    const globalMargin = totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(1) : 0;

    // Sirf 3 Main Cards: Sales, Profit/Margin, aur Loss
    const statsCards = [
        {
            title: "Total Sales",
            value: `Rs. ${data.stats.totalSales || 0}`,
            color: "var(--primary-color)"
        },
        {
            title: viewMode === "amount" ? "Net Profit" : "Profit Margin",
            value: viewMode === "amount" ? `Rs. ${totalProfit}` : `${globalMargin}%`,
            color: "var(--success-color)"
        },
        {
            title: "Loss (Damaged)",
            value: `Rs. ${data.stats.loss || 0}`,
            color: "var(--error-color)"
        }
    ];

    return (
        <div className={styles.container}>
            {loading && <Loader />}

            <div className={styles.header}>
                <div>
                    <h2>Business Analytics</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Performance tracked by {viewMode === "amount" ? "Currency" : "Percentage"}
                    </p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.toggleGroup}>
                        <button
                            className={viewMode === "amount" ? styles.activeToggle : styles.toggleBtn}
                            onClick={() => setViewMode("amount")}
                        >Rs.</button>
                        <button
                            className={viewMode === "percent" ? styles.activeToggle : styles.toggleBtn}
                            onClick={() => setViewMode("percent")}
                        >%</button>
                    </div>

                    <div className={styles.filterGroup}>
                        {['day', 'week', 'year', 'all'].map((f) => (
                            <button
                                key={f}
                                className={filter === f ? styles.activeBtn : ""}
                                onClick={() => setFilter(f)}
                            >{f.toUpperCase()}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.statsGrid}>
                {statsCards.map((item, index) => (
                    <div key={index} className={styles.card}>
                        <span className={styles.cardTitle}>{item.title}</span>
                        <h2 style={{ color: item.color }}>{item.value}</h2>
                    </div>
                ))}
            </div>

            <div className={styles.tableWrapper}>
                <h3>Recent Transactions</h3>
                <table className={styles.pTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Products</th>
                            <th>Qty</th>
                            <th>Total Sold</th>
                            <th>{viewMode === "amount" ? "Profit (Rs)" : "Margin (%)"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.recentSales.length > 0 ? (
                            data.recentSales.map((sale) => {
                                const saleCost = sale.totalAmount - sale.totalProfit;
                                const saleMargin = saleCost > 0 ? ((sale.totalProfit / saleCost) * 100).toFixed(1) : 0;
                                return (
                                    <tr key={sale._id}>
                                        <td>{new Date(sale.createdAt).toLocaleDateString('en-GB')}</td>
                                        <td data-label="Products">{sale.productNames}</td>
                                        <td data-label="Qty" style={{ fontWeight: '600', color: 'var(--text-muted)' }}>
                                            {sale.totalQty} pcs
                                        </td>
                                        <td>Rs. {sale.totalAmount}</td>
                                        <td style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>
                                            {viewMode === "amount" ? `+ Rs. ${sale.totalProfit}` : `+ ${saleMargin}%`}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No transactions found for this period.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProfitLossPage;