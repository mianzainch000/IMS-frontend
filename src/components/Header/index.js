"use client";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "@/css/Header.module.css";

// --- Icons Components ---
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const Header = ({ user }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initial search value from URL
    const [search, setSearch] = useState(searchParams.get("q") || "");

    // Badge count state (isay aap notification logic ke liye use kar sakte hain)
    const [badgeCount, setBadgeCount] = useState(0);

    // Dynamic Avatar Initial (e.g., "Zain" -> "Z")
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("q", value);
        } else {
            params.delete("q");
        }

        // Current page par hi search params update karega
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <header className={styles.header}>
            {/* 1. Search Bar */}
            <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}><SearchIcon /></span>
                <input
                    type="text"
                    placeholder="Search products, inventory..."
                    value={search}
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
            </div>

            {/* 2. Actions (Notifications & Profile) */}
            <div className={styles.actions}>
                <div className={styles.notificationBell}>
                    <BellIcon />
                    {badgeCount > 0 && <span className={styles.badge}>{badgeCount}</span>}
                </div>

                <div className={styles.userProfile}>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{user?.name || "User Name"}</span>
                        <span className={styles.userRole}>{user?.role || "Viewer"}</span>
                    </div>
                    <div className={styles.avatar}>{userInitial}</div>
                </div>
            </div>
        </header>
    );
};

export default Header;