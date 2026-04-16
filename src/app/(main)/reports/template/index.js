"use client";
import axios from "axios";
import Loader from "@/components/Loader";
import styles from "@/css/ProfitLoss.module.css";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "@/components/Snackbar";
import { handleGlobalLogout } from "@/utils/autoLogout";

const ProfitLossPage = () => {
  const showSnackbar = useSnackbar();
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
      if (error.response?.status === 403) {
        handleGlobalLogout();
      } else {
        const { message } = handleAxiosError(error);
        showSnackbar({ message, type: "error" });
      }
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(filter);
  }, [filter]);

  const getAggregatedSales = () => {
    if (!data.recentSales || data.recentSales.length === 0) return [];

    const groups = data.recentSales.reduce((acc, sale) => {
      const dateStr =
        sale.date || new Date(sale.createdAt).toLocaleDateString("en-GB");

      const productsArray = sale.productNames.split(", ");
      const itemCount = productsArray.length;

      productsArray.forEach((productName) => {
        const name = productName.trim();
        const key = `${dateStr}-${name}`;

        if (!acc[key]) {
          acc[key] = {
            _id: `${sale._id}-${name}`,
            date: dateStr,
            productNames: name,
            totalAmount: 0,
            totalProfit: 0,
            totalQty: 0,
            totalDiscount: 0,
          };
        }

        acc[key].totalAmount += Math.round(sale.totalAmount / itemCount);
        acc[key].totalProfit += Math.round(sale.totalProfit / itemCount);
        acc[key].totalQty += Math.round(sale.totalQty / itemCount);
        acc[key].totalDiscount += Math.round(
          (sale.totalDiscount || 0) / itemCount,
        );
      });

      return acc;
    }, {});

    return Object.values(groups).sort((a, b) => {
      return (
        new Date(b.date.split("/").reverse().join("-")) -
        new Date(a.date.split("/").reverse().join("-"))
      );
    });
  };

  const aggregatedSales = getAggregatedSales();

  const totalProfit = data.stats.totalProfit || 0;
  const totalCost = data.stats.totalCost || 0;
  const globalMargin =
    totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(1) : 0;

  const statsCards = [
    {
      title: "Total Sales",
      value: `Rs. ${data.stats.totalSales || 0}`,
      color: "var(--primary-color)",
    },
    {
      title: viewMode === "amount" ? "Net Profit" : "Profit Margin",
      value: viewMode === "amount" ? `Rs. ${totalProfit}` : `${globalMargin}%`,
      color: "var(--success-color)",
    },
    {
      title: "Total Discount",
      value: `Rs. ${data.stats.totalDiscount || 0}`,
      color: "#f39c12",
    },
    {
      title: "Loss (Damaged)",
      value: `Rs. ${data.stats.loss || 0}`,
      color: "var(--error-color)",
    },
  ];

  return (
    <div className={styles.container}>
      {loading && <Loader />}

      <div className={styles.header}>
        <div>
          <h2>Business Analytics</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Performance tracked by{" "}
            {viewMode === "amount" ? "Currency" : "Percentage"}
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.toggleGroup}>
            <button
              className={
                viewMode === "amount" ? styles.activeToggle : styles.toggleBtn
              }
              onClick={() => setViewMode("amount")}
            >
              Rs.
            </button>
            <button
              className={
                viewMode === "percent" ? styles.activeToggle : styles.toggleBtn
              }
              onClick={() => setViewMode("percent")}
            >
              %
            </button>
          </div>

          <div className={styles.filterGroup}>
            {["day", "week", "year", "all"].map((f) => (
              <button
                key={f}
                className={filter === f ? styles.activeBtn : ""}
                onClick={() => setFilter(f)}
              >
                {f.toUpperCase()}
              </button>
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
              <th>Discount</th>
              <th>Total Sold</th>
              <th>{viewMode === "amount" ? "Profit (Rs)" : "Margin (%)"}</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedSales.length > 0 ? (
              aggregatedSales.map((sale, index) => {
                const saleCost = sale.totalAmount - sale.totalProfit;
                const saleMargin =
                  saleCost > 0
                    ? ((sale.totalProfit / saleCost) * 100).toFixed(1)
                    : 0;

                const perPieceDiscount =
                  sale.totalQty > 0
                    ? (sale.totalDiscount / sale.totalQty).toFixed(0)
                    : 0;

                return (
                  <tr key={sale.id || index}>
                    <td>{sale.date}</td>
                    <td data-label="Products">{sale.productNames}</td>
                    <td
                      data-label="Qty"
                      style={{ fontWeight: "600", color: "var(--text-muted)" }}
                    >
                      {sale.totalQty} pcs
                    </td>
                    {}
                    <td data-label="Discount" style={{ color: "#e67e22" }}>
                      Rs. {sale.totalDiscount}
                      {sale.totalDiscount > 0 && (
                        <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                          ({perPieceDiscount}/each)
                        </div>
                      )}
                    </td>
                    <td>Rs. {sale.totalAmount}</td>
                    <td
                      style={{
                        color: "var(--success-color)",
                        fontWeight: "bold",
                      }}
                    >
                      {viewMode === "amount"
                        ? `+ Rs. ${sale.totalProfit}`
                        : `+ ${saleMargin}%`}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No transactions found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitLossPage;
