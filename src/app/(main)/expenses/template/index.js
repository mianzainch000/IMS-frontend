"use client";
import React, { useState } from "react";
import styles from "@/css/expenses.module.css";

export default function ExpensesPage() {
    const [activeTab, setActiveTab] = useState("expenses");

    // --- STATIC STORAGE STATES ---
    const [expenses, setExpenses] = useState([
        { _id: "1", title: "Bijli ka Bill", amount: 12000, category: "Bill", date: "2026-05-15", description: "April month utility bill" },
        { _id: "2", title: "Dukaan ka Rent", amount: 35000, category: "Rent", date: "2026-05-01", description: "Main market shop advanced rent" },
    ]);

    const [categories, setCategories] = useState([
        { _id: "c1", name: "Rent", isDefault: true },
        { _id: "c2", name: "Bill", isDefault: true },
        { _id: "c3", name: "Salaries", isDefault: true },
        { _id: "c4", name: "Stock Purchase", isDefault: true },
        { _id: "c5", name: "Others", isDefault: true },
    ]);

    const [expenseForm, setExpenseForm] = useState({ title: "", amount: "", category: "", date: "", description: "" });
    const [categoryForm, setCategoryForm] = useState({ name: "" });

    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const handleExpenseInputChange = (e) => {
        setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });
    };

    const handleExpenseSubmit = (e) => {
        e.preventDefault();
        if (!expenseForm.title || !expenseForm.amount || !expenseForm.category || !expenseForm.date) {
            alert("Kindly fill all required fields!");
            return;
        }

        if (editingExpenseId) {
            setExpenses(expenses.map(exp => exp._id === editingExpenseId ? { ...expenseForm, _id: editingExpenseId } : exp));
            setEditingExpenseId(null);
        } else {
            const newEntry = { ...expenseForm, _id: Date.now().toString() };
            setExpenses([newEntry, ...expenses]);
        }
        setExpenseForm({ title: "", amount: "", category: "", date: "", description: "" });
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (!categoryForm.name.trim()) return;

        if (editingCategoryId) {
            setCategories(categories.map(cat => cat._id === editingCategoryId ? { ...cat, name: categoryForm.name.trim() } : cat));
            setEditingCategoryId(null);
        } else {
            const newCat = { _id: Date.now().toString(), name: categoryForm.name.trim(), isDefault: false };
            setCategories([...categories, newCat]);
        }
        setCategoryForm({ name: "" });
    };

    const totalExpenseStatic = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return (
        <div className={styles.container}>
            {/* Top Clean Header Block */}
            <div className={styles.header}>
                <div>
                    <h2>Expense Management</h2>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                        Total Tracked Expense: <strong style={{ color: "var(--error-color)", fontSize: "1rem" }}>Rs. {totalExpenseStatic.toLocaleString()}</strong>
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className={styles.tabContainer}>
                    <button
                        onClick={() => { setActiveTab("expenses"); setEditingExpenseId(null); setExpenseForm({ title: "", amount: "", category: "", date: "", description: "" }); }}
                        className={`${styles.tabButton} ${activeTab === "expenses" ? styles.activeTabButton : ""}`}
                    >
                        Manage Expenses
                    </button>
                    <button
                        onClick={() => { setActiveTab("categories"); setEditingCategoryId(null); setCategoryForm({ name: "" }); }}
                        className={`${styles.tabButton} ${activeTab === "categories" ? styles.activeTabButton : ""}`}
                    >
                        Expense Categories
                    </button>
                </div>
            </div>

            {/* ================= TAB 1: EXPENSES GRID ================= */}
            {activeTab === "expenses" && (
                <div className={styles.mainGrid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{editingExpenseId ? "Edit Static Entry" : "Add Static Expense"}</h3>
                        <form onSubmit={handleExpenseSubmit}>
                            <div className={styles.formGroup}>
                                <label>Expense Title *</label>
                                <input type="text" name="title" value={expenseForm.title} onChange={handleExpenseInputChange} placeholder="e.g., Internet Bill" className={styles.inputField} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Amount (Rs.) *</label>
                                <input type="number" name="amount" value={expenseForm.amount} onChange={handleExpenseInputChange} placeholder="0.00" className={styles.inputField} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Category *</label>
                                <select name="category" value={expenseForm.category} onChange={handleExpenseInputChange} className={styles.selectField} required>
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Date *</label>
                                <input type="date" name="date" value={expenseForm.date} onChange={handleExpenseInputChange} className={styles.inputField} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Description Note</label>
                                <textarea rows="2" name="description" value={expenseForm.description} onChange={handleExpenseInputChange} placeholder="Write something down..." className={styles.textareaField}></textarea>
                            </div>

                            <button type="submit" className={styles.btnPrimary}>
                                {editingExpenseId ? "Update Static Entry" : "Save Static Entry"}
                            </button>
                            {editingExpenseId && (
                                <button type="button" className={styles.btnCancel} onClick={() => { setEditingExpenseId(null); setExpenseForm({ title: "", amount: "", category: "", date: "", description: "" }); }}>
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeader}>
                            <h3 className={styles.cardTitle}>Transactions Log (Static)</h3>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.customTable}>
                                <thead>
                                    <tr>
                                        <th>Title / Note</th>
                                        <th>Category</th>
                                        <th>Amount Spent</th>
                                        <th>Date Logged</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.length === 0 ? (
                                        <tr><td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)" }}>No transaction list available.</td></tr>
                                    ) : (
                                        expenses.map((exp) => (
                                            <tr key={exp._id}>
                                                <td style={{ fontWeight: "500" }}>
                                                    <div style={{ color: "var(--text-main)" }}>{exp.title}</div>
                                                    {exp.description && <small style={{ color: "var(--text-muted)", fontSize: "11px", display: "block", marginTop: "2px" }}>{exp.description}</small>}
                                                </td>
                                                <td><span className={styles.badge}>{exp.category}</span></td>
                                                <td><span className={styles.amountText}>Rs. {Number(exp.amount).toLocaleString()}</span></td>
                                                <td style={{ color: "var(--text-muted)" }}>{exp.date}</td>
                                                <td>
                                                    <div className={styles.actionsCell}>
                                                        <button className={styles.btnEdit} onClick={() => { setEditingExpenseId(exp._id); setExpenseForm(exp); }}>Edit</button>
                                                        <button className={styles.btnDelete} onClick={() => { if (confirm("Delete?")) setExpenses(expenses.filter(e => e._id !== exp._id)) }}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= TAB 2: CATEGORIES GRID ================= */}
            {activeTab === "categories" && (
                <div className={styles.categoryGrid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{editingCategoryId ? "Edit Custom Title" : "Create Custom Category"}</h3>
                        <form onSubmit={handleCategorySubmit}>
                            <div className={styles.formGroup}>
                                <label>Category Name *</label>
                                <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ name: e.target.value })} placeholder="e.g., Refreshment" className={styles.inputField} required />
                            </div>
                            <button type="submit" className={styles.btnPrimary}>
                                {editingCategoryId ? "Rename Scope" : "Add Category"}
                            </button>
                            {editingCategoryId && (
                                <button type="button" className={styles.btnCancel} onClick={() => { setEditingCategoryId(null); setCategoryForm({ name: "" }); }}>
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeader}>
                            <h3 className={styles.cardTitle}>Configured Base Scope</h3>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.customTable}>
                                <thead>
                                    <tr>
                                        <th>Category Title</th>
                                        <th>Type Scope</th>
                                        <th>Permissions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat) => (
                                        <tr key={cat._id}>
                                            <td style={{ fontWeight: "500" }}>{cat.name}</td>
                                            <td>
                                                {cat.isDefault ? (
                                                    <span className={`${styles.badge} ${styles.badgeDefault}`}>System Core</span>
                                                ) : (
                                                    <span className={styles.badge}>Custom Scope</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className={styles.actionsCell}>
                                                    <button className={styles.btnEdit} onClick={() => { setEditingCategoryId(cat._id); setCategoryForm({ name: cat.name }); }}>Rename</button>
                                                    <button className={styles.btnDelete} disabled={cat.isDefault} onClick={() => { if (confirm("Delete?")) setCategories(categories.filter(c => c._id !== cat._id)) }}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}