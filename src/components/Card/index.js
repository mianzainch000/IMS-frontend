import React from "react";
import styles from "@/css/Card.module.css";

const Card = ({ title, value, color, icon }) => {
    return (
        <div className={styles.card}>
            {/* Agar icon bheeja gaya hai toh ye div render hoga */}
            {icon && (
                <div
                    className={styles.cardIcon}
                    style={{
                        backgroundColor: `${color}15`, // Color with 15% opacity
                        color: color
                    }}
                >
                    {icon}
                </div>
            )}

            <div className={styles.cardInfo}>
                <span className={styles.cardTitle}>{title}</span>
                <h2 style={{ color: color }}>{value}</h2>
            </div>
        </div>
    );
};

export default Card;