"use client";
import { useState, useEffect } from "react";
// usePathname ko add kiya gaya hai current page detect karne ke liye
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "@/css/Header.module.css";

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

const Header = () => {
    const router = useRouter();
    const pathname = usePathname(); // Ye batayega ke hum kis page par hain
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [badgeCount, setBadgeCount] = useState(0);

    // --- Dynamic Bell Logic ---
    useEffect(() => {
        const handleUpdate = (e) => setBadgeCount(e.detail);

        // Dashboard/Products se aane wale signal ko sunna
        window.addEventListener("updateCartBadge", handleUpdate);

        // Initial fetch for badge
        const quickFetch = async () => {
            try {
                const res = await fetch("/products/api");
                const data = await res.json();
                const count = data.filter(p => p.stock > 0 && p.stock <= 5).length;
                setBadgeCount(count);
            } catch (e) { console.error(e); }
        };
        quickFetch();

        return () => window.removeEventListener("updateCartBadge", handleUpdate);
    }, []);


    // --- Fixed Search Handler ---
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("q", value);
        } else {
            params.delete("q");
        }

        // FIX: Ab ye /products par redirect nahi karega
        // Balki jis page (pathname) par aap hain, usi ka URL update karega
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <header className={styles.header}>
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

            <div className={styles.actions}>
                <div className={styles.notificationBell}>
                    <BellIcon />
                    {badgeCount > 0 && <span className={styles.badge}>{badgeCount}</span>}
                </div>

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