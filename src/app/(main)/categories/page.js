import CategoriesPage from "./template";
import PermissionWrapper from "@/components/PermissionWrapper";

const Categories = () => {
  return (
    <PermissionWrapper
      allowedRoles={["Admin", "Editor"]}
      fallback={<p className="accessDenied">Only Admin & Editor Access</p>}
    >
      <CategoriesPage />
    </PermissionWrapper>
  );
};
export default Categories;
