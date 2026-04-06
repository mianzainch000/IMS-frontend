"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/css/Users.module.css";
import Loader from "@/components/Loader";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const UsersPage = () => {
    const showSnackbar = useSnackbar();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- 1. Load Data ---
    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/users/api");
            setUsers(res.data);
        } catch (error) {
            const { message } = handleAxiosError(error);
            showSnackbar({ message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // --- 2. Update Role / Status ---
    // Ek hi generic function jo dono ko handle kare
    const updateUserDetail = async (id, payload) => {
        setLoading(true);
        try {
            const res = await axios.put(`/users/api/${id}`, payload);
            if (res.status === 200) {
                showSnackbar({ message: "Updated successfully!", type: "success" });
                loadUsers();
            }
        } catch (error) {
            const { message } = handleAxiosError(error);
            showSnackbar({ message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {loading && <Loader />}

            <div className={styles.pageHeader}>
                <div>
                    <h1>User Management</h1>
                    <p>Manage permissions and access levels for your team.</p>
                </div>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Role</th>
                            <th>Status (Click to toggle)</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>{u.firstName.charAt(0)}</div>
                                        <div>
                                            <div className={styles.userName}>{u.firstName} {u.lastName}</div>
                                            <div className={styles.userEmail}>{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className={styles.roleBadge}>{u.role}</span></td>
                                <td>
                                    <span
                                        className={u.status === "Active" ? styles.statusActive : styles.statusInactive}
                                        onClick={() => updateUserDetail(u._id, { status: u.status === "Active" ? "Inactive" : "Active" })}
                                    >
                                        {u.status || "Active"}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        className={styles.roleSelect}
                                        value={u.role}
                                        onChange={(e) => updateUserDetail(u._id, { role: e.target.value })}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Editor">Editor</option>
                                        <option value="Viewer">Viewer</option>
                                    </select>
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