"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/css/Categories.module.css";
import Loader from "@/components/Loader";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";
import ConfirmModal from "@/components/ConfirmModal"; // Confirm Modal Import
import { handleGlobalLogout } from "@/utils/autoLogout"; // Utility import lazmi karein

const CategoriesPage = () => {
    const showSnackbar = useSnackbar();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form states
    const [categoryName, setCategoryName] = useState("");
    const [editId, setEditId] = useState(null);

    // Confirm Modal States
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);


    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/categories/api");
            setCategories(res.data);
        } catch (error) {
            // 1. Check if the error is 403 (Inactive/Unauthorized)
            if (error.response?.status === 403) {
                handleGlobalLogout();
            } else {
                // 2. Baqi generic errors ke liye purana logic
                const { message } = handleAxiosError(error);
                showSnackbar({ message, type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {


        // 2. Phir API call karein jo middleware se guzre
        loadCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        setLoading(true);
        try {
            if (editId) {
                await axios.put(`/categories/api/${editId}`, { name: categoryName });
                showSnackbar({ message: "Category updated!", type: "success" });
            } else {
                await axios.post("/categories/api", { name: categoryName });
                showSnackbar({ message: "Category added!", type: "success" });
            }
            setCategoryName("");
            setEditId(null);
            loadCategories();
        } catch (error) {
            showSnackbar({ message: handleAxiosError(error).message, type: "error" });
        } finally { setLoading(false); }
    };

    const handleEditClick = (cat) => {
        setCategoryName(cat.name);
        setEditId(cat._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Modal open karne ka function
    const openDeleteModal = (id) => {
        setIdToDelete(id);
        setIsConfirmOpen(true);
    };

    // Asli delete function jo Modal ke "Confirm" button par chalega
    const confirmDelete = async () => {
        if (!idToDelete) return;
        setLoading(true);
        try {
            await axios.delete(`/categories/api/${idToDelete}`);
            showSnackbar({ message: "Category deleted!", type: "success" });
            loadCategories();
        } catch (error) {
            showSnackbar({ message: handleAxiosError(error).message, type: "error" });
        } finally {
            setLoading(false);
            setIdToDelete(null);
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className={styles.container}>
            {loading && <Loader />}

            {/* Reusable Confirm Modal */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This might affect products linked to it."
                type="danger"
            />

            <div className={styles.header}>
                <h1>Manage Categories</h1>
                <p>Create and organize categories for your products.</p>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.formCard}>
                    <h3>{editId ? "Update Category" : "Add New Category"}</h3>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label>Category Name</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="e.g. Home Appliances"
                                required
                            />
                        </div>
                        <div className={styles.formActions}>
                            <button type="submit" className={styles.addBtn}>
                                {editId ? "Update Category" : "Create Category"}
                            </button>
                            {editId && (
                                <button
                                    type="button"
                                    className={styles.cancelEditBtn}
                                    onClick={() => { setEditId(null); setCategoryName(""); }}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className={styles.listCard}>
                    <h3>All Categories ({categories.length})</h3>
                    <div className={styles.list}>
                        {categories.map((cat) => (
                            <div key={cat._id} className={styles.listItem}>
                                <div className={styles.catInfo}>
                                    <span className={styles.catName}>{cat.name}</span>
                                    <span className={styles.catCount}>&nbsp;Inventory Category</span>
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.editBtn} onClick={() => handleEditClick(cat)}>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => openDeleteModal(cat._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;