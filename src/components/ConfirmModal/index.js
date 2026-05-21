"use client";
import styles from "@/css/ConfirmModal.module.css";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        { }
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.header}>
          <h3>{title || "Are you sure?"}</h3>
        </div>

        <div className={styles.body}>
          <p>{message || "Do you really want to perform this action?"}</p>
        </div>

        <div className={styles.footer}>
          { }
          <button
            className={`${styles.btn} ${styles.cancelBtn}`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`${styles.btn} ${type === "danger" ? styles.confirmBtnDanger : styles.confirmBtnPrimary}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {type === "danger" ? "Delete" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
