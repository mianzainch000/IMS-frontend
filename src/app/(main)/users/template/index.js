"use client";
import styles from "@/css/Users.module.css";

const UsersPage = () => {
    const users = [
        { id: 1, name: "Zain Abbas", email: "zain@example.com", role: "Admin", status: "Active" },
        { id: 2, name: "Ali Khan", email: "ali@example.com", role: "Editor", status: "Inactive" },
        { id: 3, name: "Sara Ahmed", email: "sara@example.com", role: "Viewer", status: "Active" },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1>User Management</h1>
                    <p>Manage permissions and access levels for your team.</p>
                </div>
                <button className={styles.addBtn}>+ Add User</button>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>{u.name.charAt(0)}</div>
                                        <div>
                                            <div className={styles.userName}>{u.name}</div>
                                            <div className={styles.userEmail}>{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className={styles.roleBadge}>{u.role}</span></td>
                                <td>
                                    <span className={u.status === "Active" ? styles.statusActive : styles.statusInactive}>
                                        {u.status}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.editBtn}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;