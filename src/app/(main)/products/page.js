import PermissionWrapper from "@/components/PermissionWrapper";
import ProductsPage from "./template";
const PrdocutPage = () => {
  return (
    <PermissionWrapper
      allowedRoles={["Admin", "Editor"]}
      fallback={<p className="accessDenied">Only Admin & Editor Access</p>}
    >
      <ProductsPage />;
    </PermissionWrapper>
  )
};

export default PrdocutPage;
