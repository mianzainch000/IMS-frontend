"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import styles from "@/css/Users.module.css";
import Loader from "@/components/Loader";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const UsersPage = () => {
    const showSnackbar = useSnackbar();
    const searchParams = useSearchParams();

    // Search query ko normalize karna (trim + lowercase)
    const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

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

    // --- INSTANT SEARCH LOGIC ---
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;

        const query = searchQuery.toLowerCase();

        return users.filter((u) => {
            const fName = (u.firstName || "").toLowerCase();
            const lName = (u.lastName || "").toLowerCase();
            const role = (u.role || "").toLowerCase();
            const status = (u.status || "").toLowerCase();

            // ✅ STATUS (a, ac, act, active)
            if ("active".startsWith(query)) {
                return status === "active";
            }

            if ("inactive".startsWith(query)) {
                return status === "inactive";
            }

            // ✅ ROLE (e, ed, editor / v, vi, viewer / ad, adm, admin)
            if ("editor".startsWith(query)) {
                return role === "editor";
            }

            if ("viewer".startsWith(query)) {
                return role === "viewer";
            }

            if ("admin".startsWith(query)) {
                return role === "admin";
            }

            // ✅ NORMAL SEARCH (name + role + status)
            return (
                fName.includes(query) ||
                lName.includes(query) ||
                role.includes(query) ||
                status.includes(query)
            );
        });
    }, [users, searchQuery]);

    const updateUserDetail = async (id, payload) => {
        setLoading(true);
        try {
            await axios.put(`/users/api/${id}`, payload);
            showSnackbar({ message: "Updated successfully!", type: "success" });
            loadUsers();
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
                <h1>User Management</h1>
            </div>
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                                <tr key={u._id}>
                                    <td>
                                        <div className={styles.userInfo}>
                                            <div className={styles.avatar}>{u.firstName?.charAt(0)}</div>
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
                                            style={{ cursor: "pointer" }}
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    {searchQuery ? `No users found matching "${searchQuery}"` : "No users found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;