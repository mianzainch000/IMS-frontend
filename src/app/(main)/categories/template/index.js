"use client";
import { useState } from "react";
import styles from "@/css/Categories.module.css";

const CategoriesPage = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: "Electronics", count: 12 },
        { id: 2, name: "Furniture", count: 5 },
        { id: 3, name: "Accessories", count: 20 },
    ]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Manage Categories</h1>
                <p>Create and organize categories for your products.</p>
            </div>

            <div className={styles.contentGrid}>
                {/* Left Side: Add Category Form */}
                <div className={styles.formCard}>
                    <h3>Add New Category</h3>
                    <form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Category Name</label>
                            <input type="text" placeholder="e.g. Home Appliances" />
                        </div>
                        <button type="submit" className={styles.addBtn}>Create Category</button>
                    </form>
                </div>

                {/* Right Side: Categories List */}
                <div className={styles.listCard}>
                    <h3>All Categories</h3>
                    <div className={styles.list}>
                        {categories.map((cat) => (
                            <div key={cat.id} className={styles.listItem}>
                                <div>
                                    <span className={styles.catName}>{cat.name}</span>
                                    <span className={styles.catCount}>{cat.count} Products</span>
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.deleteBtn}>Delete</button>
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