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

    const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- RESET PASSWORD MODAL STATES ---
    const [resetModal, setResetModal] = useState({
        show: false,
        userId: null,
        userName: ""
    });
    const [newPassword, setNewPassword] = useState("");

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/users/api");
            setUsers(res.data || []);
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

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const query = searchQuery.toLowerCase();

        return users.filter((u) => {
            const fName = (u.firstName || "").toLowerCase();
            const lName = (u.lastName || "").toLowerCase();
            const role = (u.role || "").toLowerCase();
            const status = (u.status || "").toLowerCase();

            if ("active".startsWith(query)) return status === "active";
            if ("inactive".startsWith(query)) return status === "inactive";
            if ("editor".startsWith(query)) return role === "editor";
            if ("viewer".startsWith(query)) return role === "viewer";
            if ("admin".startsWith(query)) return role === "admin";

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
            const res = await axios.put(`/users/api/${id}`, payload);

            // Axios mein status code check karne ka sahi tariqa res.status hai
            if (res.status === 200) {
                showSnackbar({
                    message: res.data?.message || "Updated successfully!",
                    type: "success",
                    duration: 1000
                });
                loadUsers(); // Data refresh karne ke liye
            } else {
                // Agar status 200 nahi hai (maslan 400, 404 etc jo validateStatus ki wajah se error nahi bane)
                showSnackbar({
                    message: res.data?.message || "Update failed",
                    type: "error"
                });
            }
        } catch (error) {
            // HandleAxiosError aapka custom helper hai
            const { message } = handleAxiosError(error);
            showSnackbar({ message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleAdminReset = async () => {
        if (!newPassword || newPassword.length < 4) {
            showSnackbar({ message: "Password must be at least 4 characters", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const res = await axios.put(`/users/adminResetPassword/${resetModal.userId}`, {
                newPassword
            });
            showSnackbar({ message: res.data?.message || "Password updated!", type: "success" });
            setResetModal({ show: false, userId: null, userName: "" });
            setNewPassword("");
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
                            <th>Action</th>
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
                                    <td>
                                        <button
                                            className={styles.resetBtn}
                                            onClick={() => setResetModal({
                                                show: true,
                                                userId: u._id,
                                                userName: `${u.firstName} ${u.lastName}`
                                            })}
                                        >
                                            Reset Password
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    {searchQuery ? `No users found matching "${searchQuery}"` : "No users found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL IS PLACED OUTSIDE THE TABLE DIV TO PREVENT HYDRATION ERRORS */}
            {resetModal.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Reset Password</h3>
                        <p style={{ fontSize: '14px', color: '#555', marginBottom: '10px' }}>
                            New password for: <strong>{resetModal.userName}</strong>
                        </p>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            className={styles.modalInput}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoFocus
                        />

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => {
                                    setResetModal({ show: false, userId: null, userName: "" });
                                    setNewPassword("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleAdminReset}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;