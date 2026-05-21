"use client";
import React, { useState } from "react";
import styles from "@/css/expenses.module.css";

export default function ExpensesPage() {
    const [activeTab, setActiveTab] = useState("expenses");

    // --- STATIC BUSINESS METRICS ---
    const [businessData, setBusinessData] = useState({
        totalSales: 250000,
        productCost: 110000,
    });

    // --- STATIC STORAGE STATES ---
    const [expenses, setExpenses] = useState([
        { _id: "1", title: "Bijli ka Bill", amount: 12000, category: "Bill", date: "2026-05-15", description: "April month utility bill" },
        { _id: "2", title: "Dukaan ka Rent", amount: 35000, category: "Rent", date: "2026-05-01", description: "Main market shop advanced rent" },
        { _id: "3", title: "Internet Charges", amount: 3000, category: "Bill", date: "2026-05-10", description: "Office Wi-Fi" },
    ]);

    const [categories, setCategories] = useState([
        { _id: "c1", name: "Rent", isDefault: true },
        { _id: "c2", name: "Bill", isDefault: true },
        { _id: "c3", name: "Salaries", isDefault: true },
        { _id: "c4", name: "Stock Purchase", isDefault: true },
        { _id: "c5", name: "Others", isDefault: true },
    ]);

    // Form states
    const [expenseForm, setExpenseForm] = useState({ title: "", amount: "", category: "", date: "", description: "" });
    const [categoryForm, setCategoryForm] = useState({ name: "" });

    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    // --- FINANCIAL LOGIC ---
    const totalSales = businessData.totalSales;
    const totalCostOfGoods = businessData.productCost;
    const grossProfit = totalSales - totalCostOfGoods;
    const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const netProfit = grossProfit - totalExpenses;
    const isProfit = netProfit >= 0;

    // --- ACTIONS ---
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

    return (
        <div className={styles.container}>

            {/* ================= PREMIUM FINANCIAL SUMMARY PANEL ================= */}
            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.salesCard}`}>
                    <span className={styles.statLabel}>Total Sales</span>
                    <h2 className={styles.statValue}>Rs. {totalSales.toLocaleString()}</h2>
                    <span className={styles.statSubtext}>Gross revenue</span>
                </div>

                <div className={`${styles.statCard} ${styles.costCard}`}>
                    <span className={styles.statLabel}>Cost of Goods</span>
                    <h2 className={styles.statValue}>Rs. {totalCostOfGoods.toLocaleString()}</h2>
                    <span className={styles.statSubtext}>Product inventory cost</span>
                </div>

                <div className={`${styles.statCard} ${styles.grossCard}`}>
                    <span className={styles.statLabel}>Gross Profit</span>
                    <h2 className={styles.statValue}>Rs. {grossProfit.toLocaleString()}</h2>
                    <span className={styles.statSubtext}>Sales - Cost</span>
                </div>

                <div className={`${styles.statCard} ${styles.expenseCard}`}>
                    <span className={styles.statLabel}>Expenses</span>
                    <h2 className={styles.statValue}>Rs. {totalExpenses.toLocaleString()}</h2>
                    <span className={styles.statSubtext}>Operational overheads</span>
                </div>

                <div className={`${styles.statCard} ${isProfit ? styles.profitCard : styles.lossCard}`}>
                    <span className={styles.statLabel}>Net {isProfit ? "Profit" : "Loss"}</span>
                    <h2 className={styles.statValue}>Rs. {Math.abs(netProfit).toLocaleString()}</h2>
                    <span className={styles.statSubtext}>{isProfit ? "Business Profit" : "Business Loss"}</span>
                </div>
            </div>

            {/* ================= NAVIGATION HEADER ================= */}
            <div className={styles.header}>
                <div>
                    <h2>Expense & Ledger Controls</h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                        Manage operational costs and overhead expenses below.
                    </p>
                </div>

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
                    {/* Input Form */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{editingExpenseId ? "Edit Expense Entry" : "Add New Expense"}</h3>
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
                                <textarea rows="2" name="description" value={expenseForm.description} onChange={handleExpenseInputChange} placeholder="Write details here..." className={styles.textareaField}></textarea>
                            </div>

                            <button type="submit" className={styles.btnPrimary}>
                                {editingExpenseId ? "Update Entry" : "Save Expense"}
                            </button>
                            {editingExpenseId && (
                                <button type="button" className={styles.btnCancel} onClick={() => { setEditingExpenseId(null); setExpenseForm({ title: "", amount: "", category: "", date: "", description: "" }); }}>
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Logs View Wrapper */}
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeader}>
                            <h3 className={styles.cardTitle}>Operational Expense Logs</h3>
                        </div>

                        {/* DESKTOP TABLE VIEW */}
                        <div className={styles.desktopTableWrapper}>
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
                                        <tr><td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)" }}>No expenses logged yet.</td></tr>
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
                                                        <button className={styles.btnDelete} onClick={() => { if (confirm("Delete entry?")) setExpenses(expenses.filter(e => e._id !== exp._id)) }}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE RESPONSIVE CARDS VIEW */}
                        <div className={styles.mobileCardsWrapper}>
                            {expenses.length === 0 ? (
                                <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>No expenses logged yet.</div>
                            ) : (
                                expenses.map((exp) => (
                                    <div key={exp._id} className={styles.mobileDataCard}>
                                        <div className={styles.mobileCardHeader}>
                                            <div>
                                                <div className={styles.mobileCardTitle}>{exp.title}</div>
                                                <span className={styles.badge}>{exp.category}</span>
                                            </div>
                                            <div className={styles.mobileCardAmount}>Rs. {Number(exp.amount).toLocaleString()}</div>
                                        </div>
                                        {exp.description && (
                                            <p className={styles.mobileCardDesc}>{exp.description}</p>
                                        )}
                                        <div className={styles.mobileCardFooter}>
                                            <span className={styles.mobileCardDate}>📅 {exp.date}</span>
                                            <div className={styles.actionsCell}>
                                                <button className={styles.btnEdit} onClick={() => { setEditingExpenseId(exp._id); setExpenseForm(exp); }}>Edit</button>
                                                <button className={styles.btnDelete} onClick={() => { if (confirm("Delete entry?")) setExpenses(expenses.filter(e => e._id !== exp._id)) }}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* ================= TAB 2: CATEGORIES GRID ================= */}
            {activeTab === "categories" && (
                <div className={styles.categoryGrid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{editingCategoryId ? "Edit Category Name" : "Create Custom Category"}</h3>
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

                        {/* DESKTOP CATEGORY TABLE */}
                        <div className={styles.desktopTableWrapper}>
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

                        {/* MOBILE CATEGORY CARDS */}
                        <div className={styles.mobileCardsWrapper}>
                            {categories.map((cat) => (
                                <div key={cat._id} className={styles.mobileDataCard}>
                                    <div className={styles.mobileCardHeader}>
                                        <div className={styles.mobileCardTitle}>{cat.name}</div>
                                        {cat.isDefault ? (
                                            <span className={`${styles.badge} ${styles.badgeDefault}`}>System Core</span>
                                        ) : (
                                            <span className={styles.badge}>Custom Scope</span>
                                        )}
                                    </div>
                                    <div className={styles.mobileCardFooter} style={{ marginTop: "12px", paddingTop: "8px" }}>
                                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Permissions Control</span>
                                        <div className={styles.actionsCell}>
                                            <button className={styles.btnEdit} onClick={() => { setEditingCategoryId(cat._id); setCategoryForm({ name: cat.name }); }}>Rename</button>
                                            <button className={styles.btnDelete} disabled={cat.isDefault} onClick={() => { if (confirm("Delete?")) setCategories(categories.filter(c => c._id !== cat._id)) }}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}