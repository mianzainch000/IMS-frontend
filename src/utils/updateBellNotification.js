// utils/updateBellNotification.js

export const updateBellNotification = async () => {
    try {
        const res = await fetch("/products/api");
        const data = await res.json();

        const count = data.filter(
            (p) => p.stock > 0 && p.stock <= 5
        ).length;

        window.dispatchEvent(
            new CustomEvent("updateCartBadge", { detail: count })
        );
    } catch (error) {
        console.error("Bell update error:", error);
    }
};