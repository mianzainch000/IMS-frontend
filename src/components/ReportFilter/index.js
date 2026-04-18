import React from "react";
import styles from "@/css/ReportFilter.module.css";

const ReportFilter = ({
    filter,
    setFilter,
    year,
    setYear,
    month,
    setMonth,
}) => {
    const startYear = 2026;
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = startYear; y <= currentYear; y++) {
        years.push(y);
    }

    const months = [
        { val: "1", label: "January" },
        { val: "2", label: "February" },
        { val: "3", label: "March" },
        { val: "4", label: "April" },
        { val: "5", label: "May" },
        { val: "6", label: "June" },
        { val: "7", label: "July" },
        { val: "8", label: "August" },
        { val: "9", label: "September" },
        { val: "10", label: "October" },
        { val: "11", label: "November" },
        { val: "12", label: "December" },
    ];

    return (
        <div className={styles.filterContainer}>
            {/* Buttons Row */}
            <div className={styles.buttonRow}>
                {["day", "week", "all", "custom"].map((f) => (
                    <button
                        key={f}
                        className={`${styles.filterBtn} ${filter === f ? styles.activeBtn : ""}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === "custom" ? "HISTORY" : f.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Dropdowns Row (Only shows when HISTORY is active) */}
            {filter === "custom" && (
                <div className={styles.dropdownRow}>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className={styles.selectInput}
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>

                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className={styles.selectInput}
                    >
                        <option value="all">Full Year</option>
                        {months.map((m) => (
                            <option key={m.val} value={m.val}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default ReportFilter;
