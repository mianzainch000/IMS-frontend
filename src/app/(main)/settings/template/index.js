"use client";
import styles from "@/css/Settings.module.css";

const SettingsPage = () => {
    return (
        <div className={styles.container}>
            <h1>Account Settings</h1>

            <div className={styles.settingsGrid}>
                {/* Profile Section */}
                <div className={styles.card}>
                    <h3>Profile Information</h3>
                    <div className={styles.formGroup}>
                        <label>Business Name</label>
                        <input type="text" defaultValue="My Inventory Store" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" defaultValue="admin@ims.com" />
                    </div>
                    <button className={styles.saveBtn}>Update Profile</button>
                </div>

                {/* Password Section */}
                <div className={styles.card}>
                    <h3>Security</h3>
                    <div className={styles.formGroup}>
                        <label>Current Password</label>
                        <input type="password" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>New Password</label>
                        <input type="password" />
                    </div>
                    <button className={styles.saveBtn}>Change Password</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;