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

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const subtotal = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [cart]);

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toLocaleDateString() + " " + now.toLocaleTimeString();
    };

    // --- QUANTITY LOGIC ---
    const handleQtyChange = (id, value, maxStock) => {
        if (value === "") {
            setCart(prev => prev.map(item => item._id === id ? { ...item, quantity: "" } : item));
            return;
        }

        let newQty = parseInt(value);
        if (newQty > maxStock) {
            showSnackbar({ message: `Only ${maxStock} in stock!`, type: "error" });
            newQty = maxStock;
        }

        setCart(prev => prev.map(item =>
            item._id === id ? { ...item, quantity: isNaN(newQty) ? 1 : newQty } : item
        ));
    };

    const adjustQty = (id, delta, currentQty, maxStock) => {
        const nextQty = currentQty + delta;
        if (nextQty > maxStock) {
            showSnackbar({ message: "Stock limit reached!", type: "error" });
            return;
        }
        if (nextQty < 1) return;
        setCart(prev => prev.map(item => item._id === id ? { ...item, quantity: nextQty } : item));
    };

    // --- SCAN LOGIC ---
    const handleKeyDown = async (e) => {
        if (e.key === "Enter" && skuInput.trim()) {
            setLoading(true);
            try {
                const res = await axios.get(`/pos/api?sku=${skuInput}`);
                const product = res.data?.data || res.data;

                if (product && product._id) {
                    if (product.stock <= 0) {
                        showSnackbar({ message: "❌ Out of Stock!", type: "error" });
                        setSkuInput("");
                        return;
                    }

                    setCart((prev) => {
                        const isExist = prev.find((item) => item._id === product._id);
                        if (isExist) {
                            if (isExist.quantity + 1 > product.stock) {
                                showSnackbar({ message: "⚠️ Max stock reached", type: "error" });
                                return prev;
                            }
                            return prev.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
                        }
                        return [...prev, { ...product, quantity: 1 }];
                    });
                    setSkuInput("");
                } else {
                    showSnackbar({ message: "❌ Product not found", type: "error" });
                    setSkuInput("");
                }
            } catch (error) {
                showSnackbar({ message: handleAxiosError(error).message, type: "error" });
                setSkuInput("");
            } finally {
                setLoading(false);
            }
        }
    };

    // --- CHECKOUT LOGIC (Fixed for Stock Update) ---
    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            // Backend expects _id and quantity
            const payload = {
                items: cart.map(i => ({
                    _id: i._id,
                    quantity: Number(i.quantity)
                }))
            };

            const res = await axios.post("/pos/api", payload);
            showSnackbar({ message: res.data?.message || "Sale Completed!", type: "success" });

            // Printing
            window.print();

            // Safe Reset
            setTimeout(() => {
                setCart([]);
                setSkuInput("");
            }, 500);
        } catch (error) {
            showSnackbar({ message: handleAxiosError(error).message, type: "error" });
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
                        ref={inputRef} type="text" placeholder="Scan SKU..."
                        value={skuInput} onChange={(e) => setSkuInput(e.target.value)} onKeyDown={handleKeyDown}
                        className={styles.scanInput} autoComplete="off"
                    />
                </div>
                <div className={styles.cartTableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr><th>Item</th><th>Price</th><th>Qty (Stock)</th><th>Total</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item._id}>
                                    <td><strong>{item.name}</strong><br /><small>{item.sku}</small></td>
                                    <td>Rs. {item.price}</td>
                                    <td>
                                        <div className={styles.qtyControl}>
                                            <button onClick={() => adjustQty(item._id, -1, item.quantity, item.stock)}>-</button>
                                            <input
                                                type="number" className={styles.qtyInput} value={item.quantity}
                                                onChange={(e) => handleQtyChange(item._id, e.target.value, item.stock)}
                                                onBlur={(e) => { if (e.target.value === "") handleQtyChange(item._id, "1", item.stock) }}
                                            />
                                            <button onClick={() => adjustQty(item._id, 1, item.quantity, item.stock)}>+</button>
                                            <div className={styles.stockLabel}>Stock: {item.stock}</div>
                                        </div>
                                    </td>
                                    <td>Rs. {item.price * item.quantity}</td>
                                    <td><button className={styles.deleteBtn} onClick={() => setCart(c => c.filter(i => i._id !== item._id))}>×</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.summaryCard}>
                    <h3>Order Summary</h3>
                    <div className={styles.summaryRow}><span>Items</span><span>{cart.length}</span></div>
                    <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Grand Total</span><span>Rs. {subtotal}</span></div>
                    <button className={styles.checkoutBtn} onClick={handleCheckout} disabled={loading || cart.length === 0}>Complete & Print</button>
                </div>
            </div>

            {/* Print Template */}
            <div className={styles.printableBill}>
                <div className={styles.billHeader}>
                    <h2>MERA STORE</h2>
                    <p>Samundri, Punjab</p>
                    <p>Date: {getCurrentDateTime()}</p>
                    <hr />
                </div>
                <table className={styles.billTable}>
                    <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                    <tbody>
                        {cart.map((item, i) => (
                            <tr key={i}><td>{item.name}</td><td>{item.quantity}</td><td>{item.price * item.quantity}</td></tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ textAlign: 'center', marginTop: '10px' }}><strong>Total: Rs. {subtotal}</strong><p>Thanks for visiting!</p></div>
            </div>
        </div>
    );
};

export default POSPage;