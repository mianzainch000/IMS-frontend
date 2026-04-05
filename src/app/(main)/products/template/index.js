"use client";
import { useState } from "react"; // 1. State add ki
import styles from "@/css/Products.module.css";
import ProductModal from "@/components/ProductModal"; // 2. Modal import kiya

// SVG Icons for Actions
const Icons = {
    Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Delete: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
};

const ProductsPage = () => {
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Static Data
    const products = [
        { id: 1, name: "Wireless Mouse", sku: "MS-001", category: "Electronics", price: "$25.00", stock: 150 },
        { id: 2, name: "HD Monitor", sku: "MN-042", category: "Electronics", price: "$180.00", stock: 12 },
        { id: 3, name: "Office Desk", sku: "FN-992", category: "Furniture", price: "$120.00", stock: 5 },
    ];

    return (
        <div className={styles.container}>
            {/* Modal Component yahan rakha hai */}
            <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Top Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1>Products</h1>
                    <p>Manage your inventory and stock levels.</p>
                </div>
                {/* Button par onClick handler lagaya */}
                <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                    <Icons.Plus />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Table Section */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td className={styles.productCell}>{p.name}</td>
                                <td>{p.sku}</td>
                                <td><span className={styles.catBadge}>{p.category}</span></td>
                                <td>{p.price}</td>
                                <td>
                                    <span className={p.stock < 20 ? styles.lowStock : ""}>
                                        {p.stock} pcs
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionGroup}>
                                        <button className={styles.editBtn} title="Edit"><Icons.Edit /></button>
                                        <button className={styles.deleteBtn} title="Delete"><Icons.Delete /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsPage;