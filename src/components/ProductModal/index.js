"use client";
import { useState, useEffect } from "react";
import styles from "@/css/Modal.module.css";
import Loader from "@/components/Loader";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";
import axios from "axios";
import { updateBellNotification } from "@/utils/updateBellNotification";

const ProductModal = ({ isOpen, onClose, refreshData, productToEdit }) => {
    const showAlert = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]); // Dynamic categories state

    const initialState = {
        name: "",
        sku: "",
        category: "", // Initial empty, niche useEffect mein set hoga
        price: "",
        stock: "",
    };

    const [formData, setFormData] = useState(initialState);

    // 1. Categories load karne ka function
    const loadCategories = async () => {
        try {
            const res = await axios.get("/categories/api");
            setCategories(res.data);

            // Agar naya product hai, toh pehli category default set kar dein
            if (!productToEdit && res.data.length > 0) {
                setFormData((prev) => ({ ...prev, category: res.data[0].name }));
            }
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadCategories(); // Modal khulne par categories refresh hongi
        }

        if (productToEdit) {
            setFormData({
                name: productToEdit.name || "",
                sku: productToEdit.sku || "",
                category: productToEdit.category || "",
                price: productToEdit.price || "",
                stock: productToEdit.stock || "",
            });
        } else {
            setFormData(initialState);
        }
    }, [productToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category)
            return showAlert({ message: "Please select a category", type: "error" });

        setLoading(true);
        try {
            const url = productToEdit
                ? `/products/api/${productToEdit._id}`
                : "/products/api";

            const method = productToEdit ? "put" : "post";
            const res = await axios[method](url, formData);
            await updateBellNotification(); // 🔥 IMPORTANT

            if (res.status === 201 || res.status === 200) {
                showAlert({
                    message: res.data.message || "Operation successful!",
                    type: "success",
                });
                refreshData();
                onClose();
            }
        } catch (error) {
            const { message } = handleAxiosError(error);
            showAlert({ message: message || "Something went wrong!", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            {loading && <Loader />}

            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{productToEdit ? "Edit Product" : "Add New Product"}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
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
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Product Name</label>
                        <input
                            name="name"
                            type="text"
                            className={styles.input}
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>SKU</label>
                        <input
                            name="sku"
                            type="text"
                            className={styles.input}
                            placeholder="Enter SKU"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Category</label>
                        <select
                            name="category"
                            className={styles.select}
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {/* 2. Categories ko dynamic map kiya yahan */}
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {categories.length === 0 && (
                            <small style={{ color: "var(--error-color)", fontSize: "11px" }}>
                                No categories found. Please add one first.
                            </small>
                        )}
                    </div>

                    <div className={styles.row}>
                        {" "}
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label>Price</label>
                            <input
                                name="price"
                                type="number"
                                className={styles.input}
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label>Stock</label>
                            <input
                                name="stock"
                                type="number"
                                className={styles.input}
                                placeholder="0"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={loading || categories.length === 0}
                        >
                            {loading
                                ? "Saving..."
                                : productToEdit
                                    ? "Update Changes"
                                    : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
