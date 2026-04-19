"use client";
import { useState, useEffect } from "react";
import styles from "@/css/Header.module.css";
import PermissionWrapper from "../PermissionWrapper";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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

const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const Header = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");

  const [badgeCount, setBadgeCount] = useState(0);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const hideSearchOn = ["/categories", "/pos", "/report"];
  const shouldShowSearch = !hideSearchOn.includes(pathname);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const handleUpdateBadge = (event) => {
      setBadgeCount(event.detail);
    };

    window.addEventListener("updateCartBadge", handleUpdateBadge);
    return () =>
      window.removeEventListener("updateCartBadge", handleUpdateBadge);
  }, []);

  return (
    <PermissionWrapper allowedRoles={["Admin", "Editor"]}>
      <header className={styles.header}>
        {}
        <div className={styles.leftSection}>
          {shouldShowSearch ? (
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search products, inventory..."
                value={search}
                onChange={handleSearch}
                className={styles.searchInput}
              />
            </div>
          ) : (
            <div className={styles.pageTitle}>
              {}
              <h2> Overview</h2>
            </div>
          )}
        </div>

        {}
        <div className={styles.actions}>
          <div className={styles.notificationBell}>
            <BellIcon />
            {badgeCount > 0 && (
              <span className={styles.badge}>{badgeCount}</span>
            )}
          </div>

          <div className={styles.userProfile}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user?.name || "Zain Ishfaq"}
              </span>
              <span className={styles.userRole}>{user?.role || "Admin"}</span>
            </div>
            <div className={styles.avatar}>{userInitial}</div>
          </div>
        </div>
      </header>
    </PermissionWrapper>
  );
};

export default Header;
