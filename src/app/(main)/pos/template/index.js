"use client";
import axios from "axios";
import Loader from "@/components/Loader";
import styles from "@/css/POS.module.css";
import { useSnackbar } from "@/components/Snackbar";
import { handleGlobalLogout } from "@/utils/autoLogout";
import { useState, useRef, useEffect, useMemo } from "react";
import handleAxiosError from "@/components/HandleAxiosError";

const POSPage = () => {
  const [cart, setCart] = useState([]);
  const [skuInput, setSkuInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState("");
  const inputRef = useRef(null);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0,
    );
  }, [cart]);

  const returnAmount =
    receivedAmount !== "" ? Number(receivedAmount) - subtotal : null;

  const handlePriceChange = (id, newPrice) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, price: newPrice } : item,
      ),
    );
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString() + " " + now.toLocaleTimeString();
  };

  const handleQtyChange = (id, value, maxStock) => {
    if (value === "") {
      setCart((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, quantity: "" } : item,
        ),
      );
      return;
    }
    let newQty = parseInt(value);
    if (newQty > maxStock) {
      showSnackbar({ message: `Only ${maxStock} in stock!`, type: "error" });
      newQty = maxStock;
    }
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: isNaN(newQty) ? 1 : newQty }
          : item,
      ),
    );
  };

  const adjustQty = (id, delta, currentQty, maxStock) => {
    const nextQty = (Number(currentQty) || 0) + delta;
    if (nextQty > maxStock) {
      showSnackbar({ message: "Stock limit reached!", type: "error" });
      return;
    }
    if (nextQty < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: nextQty } : item,
      ),
    );
  };

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
                showSnackbar({
                  message: "⚠️ Max stock reached",
                  type: "error",
                });
                return prev;
              }
              return prev.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              );
            }
            return [...prev, { ...product, quantity: 1 }];
          });
          setSkuInput("");
        } else {
          showSnackbar({ message: "❌ Product not found", type: "error" });
          setSkuInput("");
          handleGlobalLogout();
        }
      } catch (error) {
        if (error.response?.status === 403) {
          handleGlobalLogout();
        } else {
          const { message } = handleAxiosError(error);
          showSnackbar({ message, type: "error" });
        }
        setSkuInput("");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const payload = {
        items: cart.map((i) => ({
          _id: i._id,
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
      };
      const res = await axios.post("/pos/api", payload);
      showSnackbar({
        message: res.data?.message || "Sale Completed!",
        type: "success",
      });
      window.print();
      setTimeout(() => {
        setCart([]);
        setSkuInput("");
        setReceivedAmount("");
      }, 500);
    } catch (error) {
      showSnackbar({ message: handleAxiosError(error).message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleContainerClick = (e) => {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON") {
      inputRef.current?.focus();
    }
  };

  return (
    <div className={styles.posContainer} onClick={handleContainerClick}>
      {loading && <Loader />}

      {}
      <div className={styles.leftSection}>
        <div className={styles.scanHeader}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Scan SKU..."
            value={skuInput}
            onChange={(e) => setSkuInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.scanInput}
            autoComplete="off"
          />
        </div>

        <div className={styles.cartTableWrapper}>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Price (Edit)</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <tr key={item._id} className={styles.row}>
                    <td data-label="Item">
                      <div className={styles.productCell}>
                        <span className={styles.pName}>{item.name}</span>
                        <span className={styles.pSku}>{item.sku}</span>
                      </div>
                    </td>
                    <td data-label="Price">
                      <div className={styles.priceEditInputWrapper}>
                        <span>Rs.</span>
                        <input
                          type="number"
                          className={styles.editablePriceInput}
                          value={item.price}
                          onChange={(e) =>
                            handlePriceChange(item._id, e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td data-label="Quantity">
                      <div className={styles.qtyContainer}>
                        <div className={styles.qtyControl}>
                          <button
                            onClick={() =>
                              adjustQty(item._id, -1, item.quantity, item.stock)
                            }
                          >
                            −
                          </button>
                          <input
                            type="number"
                            className={styles.qtyInput}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQtyChange(
                                item._id,
                                e.target.value,
                                item.stock,
                              )
                            }
                            onBlur={(e) => {
                              if (e.target.value === "")
                                handleQtyChange(item._id, "1", item.stock);
                            }}
                          />
                          <button
                            onClick={() =>
                              adjustQty(item._id, 1, item.quantity, item.stock)
                            }
                          >
                            +
                          </button>
                        </div>
                        <span className={styles.stockLabel}>
                          Stock: {item.stock}
                        </span>
                      </div>
                    </td>
                    <td data-label="Total">
                      Rs.{" "}
                      {(Number(item.price) || 0) * (Number(item.quantity) || 0)}
                    </td>
                    <td data-label="Action">
                      <button
                        className={styles.deleteBtn}
                        onClick={() =>
                          setCart((c) => c.filter((i) => i._id !== item._id))
                        }
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.emptyMessageRow}>
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>🛒</div>
                      <p>No items added yet. Scan a product to start!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      <div className={styles.rightSection}>
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Items</span>
              <span>{cart.length}</span>
            </div>
            <hr className={styles.divider} />
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Grand Total</span>
              <span>Rs. {subtotal}</span>
            </div>
          </div>

          {}
          <div className={styles.receivedWrapper}>
            <label className={styles.receivedLabel}>
              Customer nay diye (Rs.)
            </label>
            <input
              type="number"
              className={`${styles.receivedInput} ${
                receivedAmount !== "" && Number(receivedAmount) < subtotal
                  ? styles.inputError
                  : ""
              }`}
              placeholder="Amount enter karo..."
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <p
              className={`${styles.receivedHint} ${
                receivedAmount === ""
                  ? ""
                  : Number(receivedAmount) < subtotal
                    ? styles.hintError
                    : styles.hintSuccess
              }`}
            >
              {receivedAmount === ""
                ? ""
                : Number(receivedAmount) < subtotal
                  ? `⚠ Rs. ${subtotal - Number(receivedAmount)} kam hain`
                  : `✓ Rs. ${Number(receivedAmount) - subtotal} wapas karo`}
            </p>
          </div>

          <div className={styles.paymentCards}>
            <div className={styles.payCard}>
              <span className={styles.payCardLabel}>Total Bill</span>
              <span className={styles.payCardValue}>Rs. {subtotal}</span>
            </div>
            <div className={styles.payCard}>
              <span className={styles.payCardLabel}>Diye</span>
              <span
                className={`${styles.payCardValue} ${
                  receivedAmount !== "" ? styles.paySuccess : ""
                }`}
              >
                {receivedAmount !== "" ? `Rs. ${Number(receivedAmount)}` : "—"}
              </span>
            </div>
            <div className={styles.payCard}>
              <span className={styles.payCardLabel}>Wapas karo</span>
              <span
                className={`${styles.payCardValue} ${
                  returnAmount !== null
                    ? returnAmount >= 0
                      ? styles.paySuccess
                      : styles.payDanger
                    : ""
                }`}
              >
                {returnAmount !== null
                  ? returnAmount >= 0
                    ? `Rs. ${returnAmount}`
                    : `Rs. ${Math.abs(returnAmount)} kam`
                  : "—"}
              </span>
            </div>
          </div>

          <button
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
          >
            Complete & Print
          </button>
        </div>
      </div>

      {}
      <div className={styles.printableBill}>
        <div className={styles.billHeader}>
          <h2>MERA STORE</h2>
          <p>Samundri, Punjab</p>
          <p>Date: {getCurrentDateTime()}</p>
          <div className={styles.billDivider}></div>
        </div>
        <table className={styles.billTable}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  {(Number(item.price) || 0) * (Number(item.quantity) || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.billFooter}>
          <strong>Total: Rs. {subtotal}</strong>
          {}
          {}
          <p>Thanks for visiting!</p>
        </div>
      </div>
    </div>
  );
};

export default POSPage;
