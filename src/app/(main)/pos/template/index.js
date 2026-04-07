"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import styles from "@/css/POS.module.css";
import Loader from "@/components/Loader";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const POSPage = () => {
    const [cart, setCart] = useState([]);
    const [skuInput, setSkuInput] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const showSnackbar = useSnackbar();

    // Auto-focus on scan input when page loads
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Memoized Total Calculation
    const subtotal = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [cart]);

    // --- QUANTITY LOGIC ---
    const handleQtyChange = (id, value) => {
        const newQty = parseInt(value);
        setCart(prev => prev.map(item =>
            item._id === id ? { ...item, quantity: (isNaN(newQty) || newQty < 1) ? 1 : newQty } : item
        ));
    };

    const adjustQty = (id, delta) => {
        setCart(prev => prev.map(item =>
            item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    // --- SCAN LOGIC ---
    const handleKeyDown = async (e) => {
        if (e.key === "Enter" && skuInput.trim()) {
            setLoading(true);
            try {
                const res = await axios.get(`/pos/api?sku=${skuInput}`);
                const product = res.data?.data || res.data;

                if (product && (product._id || product.id)) {
                    setCart((prev) => {
                        const isExist = prev.find((item) => item._id === product._id);
                        if (isExist) {
                            return prev.map((item) =>
                                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                            );
                        }
                        return [...prev, { ...product, quantity: 1 }];
                    });
                    setSkuInput("");
                } else {
                    showSnackbar({ message: "Invalid product data", type: "error" });
                }
            } catch (error) {
                const { message } = handleAxiosError(error);
                showSnackbar({ message, type: "error" });
                setSkuInput("");
            } finally {
                setLoading(false);
            }
        }
    };

    // --- CHECKOUT LOGIC ---
    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const payload = { items: cart.map(i => ({ _id: i._id, quantity: i.quantity })) };
            const res = await axios.post("/pos/api", payload);
            showSnackbar({ message: res.data?.message || "Sale Completed!", type: "success" });
            setCart([]);
        } catch (error) {
            const { message } = handleAxiosError(error);
            showSnackbar({ message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.posContainer} onClick={() => inputRef.current?.focus()}>
            {loading && <Loader />}

            <div className={styles.leftSection}>
                <div className={styles.scanHeader}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Scan SKU and press Enter..."
                        value={skuInput}
                        onChange={(e) => setSkuInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={styles.scanInput}
                        autoComplete="off"
                    />
                </div>

                <div className={styles.cartTableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item._id || item.id}>
                                    <td>
                                        <strong>{item.name}</strong><br />
                                        <small>{item.sku}</small>
                                    </td>
                                    <td>Rs. {item.price}</td>
                                    <td>
                                        <div className={styles.qtyControl}>
                                            <button onClick={() => adjustQty(item._id, -1)}>-</button>
                                            <input
                                                type="number"
                                                className={styles.qtyInput}
                                                value={item.quantity}
                                                onChange={(e) => handleQtyChange(item._id, e.target.value)}
                                            />
                                            <button onClick={() => adjustQty(item._id, 1)}>+</button>
                                        </div>
                                    </td>
                                    <td>Rs. {item.price * item.quantity}</td>
                                    <td>
                                        <button className={styles.deleteBtn} onClick={() => setCart(c => c.filter(i => i._id !== item._id))}>×</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.summaryCard}>
                    <h3>Order Summary</h3>
                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>Rs. {subtotal}</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                        <span>Grand Total</span>
                        <span>Rs. {subtotal}</span>
                    </div>
                    <button
                        className={styles.checkoutBtn}
                        onClick={handleCheckout}
                        disabled={loading || cart.length === 0}
                    >
                        {loading ? "Processing..." : "Complete Sale"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POSPage;