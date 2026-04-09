import PermissionWrapper from "@/components/PermissionWrapper";
import CategoriesPage from "./template";

const Categories = () => {
  return (
    <PermissionWrapper
      allowedRoles={["Admin", "Editor"]}
      fallback={<p className="accessDenied">Only Admin & Editor Access</p>}
    >
      <CategoriesPage />;
    </PermissionWrapper>
  );
};
export default Categories;
