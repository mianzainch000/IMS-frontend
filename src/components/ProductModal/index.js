"use client";
import styles from "@/css/Modal.module.css";

const ProductModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

                {/* Modal Header with Close Button */}
                <div className={styles.modalHeader}>
                    <h2>Add New Product</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.formGroup}>
                        <label>Product Name</label>
                        <input type="text" className={styles.input} placeholder="Enter product name" required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>SKU</label>
                        <input type="text" className={styles.input} placeholder="Enter SKU" required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Category</label>
                        <select className={styles.select}>
                            <option>Electronics</option>
                            <option>Furniture</option>
                            <option>Accessories</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label>Price</label>
                            <input type="number" className={styles.input} placeholder="0.00" required />
                        </div>
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label>Stock</label>
                            <input type="number" className={styles.input} placeholder="0" required />
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.saveBtn}>Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;