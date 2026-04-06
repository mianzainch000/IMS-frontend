export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  signup: "signup",
  login: "login",
  forgotPassword: "forgotPassword",
  resetPassword: "resetPassword",
  addProduct: "addProduct",
  getProduct: "getProduct",
  updateProduct: "updateProduct",
  deleteProduct: "deleteProduct",
  addCategory: "addCategory",
  getCategory: "getCategory",
  updateCategory: "updateCategory",
  deleteCategory: "deleteCategory",
  allUsers: "allUsers", // GET: Saare users lane ke liye
  updateRole: "updateRole", // PUT: Role badalne ke liye (/updateRole/:id)
  adminResetPassword: "adminResetPassword", // Naya endpoint add kiya
};
