"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/css/Products.module.css";
import ProductModal from "@/components/ProductModal";
import Loader from "@/components/Loader"; // Loader import kiya
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

// Icons Object
const Icons = {
    Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Delete: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
};

const ProductsPage = () => {
    const showSnackbar = useSnackbar();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false); // Loader state
    const [productToEdit, setProductToEdit] = useState(null);

    // --- 1. Load Data (GET) ---
    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/products/api");
            setProducts(res.data);
        } catch (error) {
            const { message } = handleAxiosError(error);
            showSnackbar({ message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // --- 2. Delete Logic ---
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setLoading(true);
        try {
            await axios.delete(`/products/api/${id}`);
            showSnackbar({ message: "Product deleted!", type: "success" });
            loadProducts(); // Refresh Table
        } catch (error) {
            const { message } = handleAxiosError(error);
            showSnackbar({ message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // --- 3. Edit Handler ---
    const handleEditClick = (product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            {/* Global Loader */}
            {loading && <Loader />}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setProductToEdit(null);
                }}
                refreshData={loadProducts}
                productToEdit={productToEdit}
            />

            <div className={styles.pageHeader}>
                <div>
                    <h1>Products</h1>
                    <p>Manage your inventory and stock levels.</p>
                </div>
                <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                    <Icons.Plus />
                    <span>Add Product</span>
                </button>
            </div>

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
                        {products.length > 0 ? (
                            products.map((p) => (
                                <tr key={p._id}>
                                    <td className={styles.productCell}>{p.name}</td>
                                    <td>{p.sku}</td>
                                    <td><span className={styles.catBadge}>{p.category}</span></td>
                                    <td>${p.price}</td>
                                    <td>
                                        <span className={p.stock < 20 ? styles.lowStock : ""}>
                                            {p.stock} pcs
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => handleEditClick(p)}
                                            >
                                                <Icons.Edit />
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(p._id)}
                                            >
                                                <Icons.Delete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            !loading && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No products found.
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsPage;