"use client";
import { useState } from "react";
import styles from "@/css/Header.module.css";

// SVG Icon Component (Defined outside for better performance)
const SearchIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const Header = () => {
    const [search, setSearch] = useState("");

    return (
        <header className={styles.header}>
            {/* Search Bar Section */}
            <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    placeholder="Search products, inventory..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* User Actions Section */}
            <div className={styles.actions}>
                <div className={styles.userProfile}>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Zain Ishfaq</span>
                        <span className={styles.userRole}>Administrator</span>
                    </div>
                    <div className={styles.avatar}>Z</div>
                </div>
            </div>
        </header>
    );
};

export default Header;