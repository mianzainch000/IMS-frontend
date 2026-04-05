"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/css/Categories.module.css";
import Loader from "@/components/Loader";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const CategoriesPage = () => {
    const showSnackbar = useSnackbar();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form states
    const [categoryName, setCategoryName] = useState("");
    const [editId, setEditId] = useState(null); // Track karney ke liye ke edit ho raha hai ya add

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/categories/api");
            setCategories(res.data);
        } catch (error) {
            showSnackbar({ message: handleAxiosError(error).message, type: "error" });
        } finally { setLoading(false); }
    };

    useEffect(() => { loadCategories(); }, []);

    // Add ya Update handle karein
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        setLoading(true);
        try {
            if (editId) {
                // UPDATE Logic
                await axios.put(`/categories/api/${editId}`, { name: categoryName });
                showSnackbar({ message: "Category updated!", type: "success" });
            } else {
                // ADD Logic
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

    // Edit mode on karein
    const handleEditClick = (cat) => {
        setCategoryName(cat.name);
        setEditId(cat._id); // MongoDB ki ID use karein
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Form ki taraf scroll
    };

    const handleDelete = async (id) => {
        if (!id) return showSnackbar({ message: "Invalid ID", type: "error" });
        if (!confirm("Are you sure?")) return;

        setLoading(true);
        try {
            await axios.delete(`/categories/api/${id}`);
            showSnackbar({ message: "Deleted!", type: "success" });
            loadCategories();
        } catch (error) {
            showSnackbar({ message: handleAxiosError(error).message, type: "error" });
        } finally { setLoading(false); }
    };

    return (
        <div className={styles.container}>
            {loading && <Loader />}
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
                        <button type="submit" className={styles.addBtn}>
                            {editId ? "Update Category" : "Create Category"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => { setEditId(null); setCategoryName(""); }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>

                <div className={styles.listCard}>
                    <h3>All Categories ({categories.length})</h3>
                    <div className={styles.list}>
                        {categories.map((cat) => (
                            <div key={cat._id} className={styles.listItem}>
                                <div className={styles.catInfo}>                                    <span className={styles.catName}>{cat.name}</span>
                                    <span className={styles.catCount}>&nbsp;Inventory Category</span>
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.editBtn} onClick={() => handleEditClick(cat)}>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(cat._id)}>Delete</button>
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