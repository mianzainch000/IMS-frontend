"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import ReportFilter from "@/components/ReportFilter";
import StatsCard from "@/components/Card";
import { useSnackbar } from "@/components/Snackbar";
import { handleGlobalLogout } from "@/utils/autoLogout";
import styles from "@/css/ProfitLoss.module.css";

const ProfitLossPage = () => {
  const showSnackbar = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState("all");
  const [viewMode, setViewMode] = useState("amount");
  const [data, setData] = useState({ stats: {}, recentSales: [] });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const query = `filter=${filter}&year=${year}&month=${month}`;
      const res = await axios.get(`/report/api?${query}`);
      setData(res.data);
    } catch (error) {
      if (error.response?.status === 403) {
        handleGlobalLogout();
      } else {
        showSnackbar({ message: error.message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [filter, year, month]);

  const totalProfit = data.stats.totalProfit || 0;
  const totalCost = data.stats.totalCost || 0;
  const globalMargin = totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(1) : 0;

  const statsCards = [
    { title: "Total Sales", value: `Rs. ${data.stats.totalSales || 0}`, color: "var(--primary-color)" },
    {
      title: viewMode === "amount" ? "Net Profit" : "Profit Margin",
      value: viewMode === "amount" ? `Rs. ${totalProfit}` : `${globalMargin}%`,
      color: "var(--success-color)"
    },
    { title: "Total Discount", value: `Rs. ${data.stats.totalDiscount || 0}`, color: "#f39c12" },
    { title: "Loss (Damaged)", value: `Rs. ${data.stats.loss || 0}`, color: "var(--error-color)" },
  ];

  return (
    <div className={styles.container}>
      {loading && <Loader />}

      <div className={styles.header}>
        <div>
          <h2>Business Analytics</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Performance by {viewMode === "amount" ? "Currency" : "Percentage"}
          </p>
        </div>

        <div className={styles.topActions}>
          <div className={styles.toggleGroup}>
            <button className={viewMode === "amount" ? styles.activeToggle : styles.toggleBtn} onClick={() => setViewMode("amount")}>Rs.</button>
            <button className={viewMode === "percent" ? styles.activeToggle : styles.toggleBtn} onClick={() => setViewMode("percent")}>%</button>
          </div>
          <br />
          <ReportFilter
            filter={filter} setFilter={setFilter}
            year={year} setYear={setYear}
            month={month} setMonth={setMonth}
          />
        </div>
      </div>

      {/* Stats Grid using the new StatsCard component */}
      <div className={styles.statsGrid}>
        {statsCards.map((item, index) => (
          <StatsCard
            key={index}
            title={item.title}
            value={item.value}
            color={item.color}
          />
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
              <th>Discount</th>
              <th>Total Sold</th>
              <th>{viewMode === "amount" ? "Profit (Rs)" : "Margin (%)"}</th>
            </tr>
          </thead>
          <tbody>
            {data.recentSales.length > 0 ? (
              data.recentSales.map((sale, index) => {
                const saleCost = sale.totalAmount - sale.totalProfit;
                const saleMargin = saleCost > 0 ? ((sale.totalProfit / saleCost) * 100).toFixed(1) : 0;
                return (
                  <tr key={index}>
                    <td>{sale.date}</td>
                    <td data-label="Products">{sale.productNames}</td>
                    <td data-label="Qty"> {sale.totalQty} pcs </td>
                    <td data-label="Discount" style={{ color: "#e67e22" }}>Rs. {sale.totalDiscount}</td>
                    <td>Rs. {sale.totalAmount}</td>
                    <td style={{ color: "var(--success-color)", fontWeight: "bold" }}>
                      {viewMode === "amount" ? `+ Rs. ${sale.totalProfit}` : `+ ${saleMargin}%`}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>No transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitLossPage;