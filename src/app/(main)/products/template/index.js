"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // New import for search
import axios from "axios";
import styles from "@/css/Products.module.css";
import ProductModal from "@/components/ProductModal";
import Loader from "@/components/Loader";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";
import ConfirmModal from "@/components/ConfirmModal";
import { updateBellNotification } from "@/utils/updateBellNotification";
// Icons Object
const Icons = {
    Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Delete: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
};

const ProductsPage = () => {
    const showSnackbar = useSnackbar();
    const searchParams = useSearchParams(); // Header ki search query pakarne ke liye
    const searchQuery = searchParams.get("q")?.toLowerCase() || "";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);

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

    // --- 2. Dynamic Filter Logic ---
    const filteredProducts = products.filter((p) => {
        const query = searchQuery.toLowerCase();
        return (
            // Ab sirf wohi dikhayega jo is letter se shuru hote hain
            p.name?.toLowerCase().startsWith(query) ||
            p.sku?.toLowerCase().startsWith(query) ||
            p.category?.toLowerCase().startsWith(query)
        );
    });

    // --- 3. Delete Flow ---
    const handleDeleteClick = (id) => {
        setProductIdToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!productIdToDelete) return;
        setLoading(true);
        try {
            const res = await axios.delete(`/products/api/${productIdToDelete}`);
            await updateBellNotification(); // 🔥 IMPORTANT

            if (res.status === 200) {
                showSnackbar({
                    message: res.data.message || "Product deleted!",
                    type: "success",
                });
                loadProducts();
            }

        } catch (error) {
            const { message } = handleAxiosError(error);
            showSnackbar({ message, type: "error" });
        } finally {
            setLoading(false);
            setProductIdToDelete(null);
            setIsConfirmOpen(false);
        }
    };

    const handleEditClick = (product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            {loading && <Loader />}

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                type="danger"
            />

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
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((p) => (
                                <tr key={p._id}>
                                    <td data-label="Product Name">{p.name}</td>
                                    <td data-label="SKU">{p.sku}</td>
                                    <td data-label="Category">
                                        <span className={styles.catBadge}>{p.category}</span>
                                    </td>
                                    <td data-label="Price">${p.price}</td>
                                    <td data-label="Stock">
                                        {/* Low stock coloring (yahan aap apni marzi ka limit set kar sakte hain) */}
                                        <span className={p.stock <= 5 ? styles.lowStock : ""}>
                                            {p.stock} pcs
                                        </span>
                                    </td>
                                    <td data-label="Actions">
                                        <div className={styles.actionGroup}>
                                            <button className={styles.editBtn} onClick={() => handleEditClick(p)}>
                                                <Icons.Edit />
                                            </button>
                                            <button className={styles.deleteBtn} onClick={() => handleDeleteClick(p._id)}>
                                                <Icons.Delete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            !loading && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        {searchQuery ? `No products found for "${searchQuery}"` : "No products found."}
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