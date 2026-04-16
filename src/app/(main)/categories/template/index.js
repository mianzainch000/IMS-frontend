"use client";
import axios from "axios";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import styles from "@/css/Categories.module.css";
import { useSnackbar } from "@/components/Snackbar";
import ConfirmModal from "@/components/ConfirmModal";
import { handleGlobalLogout } from "@/utils/autoLogout";
import handleAxiosError from "@/components/HandleAxiosError";
import PermissionWrapper from "@/components/PermissionWrapper";

const Icons = {
  Plus: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Edit: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Delete: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  ),
};
const CategoriesPage = () => {
  const showSnackbar = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/categories/api");
      setCategories(res.data);
    } catch (error) {
      if (error.response?.status === 403) {
        handleGlobalLogout();
      } else {
        const { message } = handleAxiosError(error);
        showSnackbar({ message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/categories/api/${editId}`, { name: categoryName });
        showSnackbar({ message: "Category updated!", type: "success" });
      } else {
        await axios.post("/categories/api", { name: categoryName });
        showSnackbar({ message: "Category added!", type: "success" });
      }
      setCategoryName("");
      setEditId(null);
      loadCategories();
    } catch (error) {
      showSnackbar({ message: handleAxiosError(error).message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (cat) => {
    setCategoryName(cat.name);
    setEditId(cat._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteModal = (id) => {
    setIdToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    setLoading(true);
    try {
      await axios.delete(`/categories/api/${idToDelete}`);
      showSnackbar({ message: "Category deleted!", type: "success" });
      loadCategories();
    } catch (error) {
      showSnackbar({ message: handleAxiosError(error).message, type: "error" });
    } finally {
      setLoading(false);
      setIdToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Loader />}

      {}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This might affect products linked to it."
        type="danger"
      />

      <div className={styles.header}>
        <h1>Manage Categories</h1>
        <p>Create and organize categories for your products.</p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.formCard}>
          <h3>{editId ? "Update Category" : "Add New Category"}</h3>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Home Appliances"
                required
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.addBtn}>
                {editId ? "Update Category" : "Create Category"}
              </button>
              {editId && (
                <button
                  type="button"
                  className={styles.cancelEditBtn}
                  onClick={() => {
                    setEditId(null);
                    setCategoryName("");
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className={styles.listCard}>
          <h3>All Categories ({categories.length})</h3>
          <div className={styles.list}>
            {categories.map((cat) => (
              <div key={cat._id} className={styles.listItem}>
                <div className={styles.catInfo}>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={styles.catCount}>
                    &nbsp;Inventory Category
                  </span>
                </div>
                <div className={styles.actions}>
                  <PermissionWrapper allowedRoles={["Admin", "Editor"]}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEditClick(cat)}
                    >
                      <Icons.Edit />
                    </button>
                  </PermissionWrapper>

                  <PermissionWrapper allowedRoles={["Admin"]}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => openDeleteModal(cat._id)}
                    >
                      <Icons.Delete />
                    </button>
                  </PermissionWrapper>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
