import ProductsPage from "./template";
import PermissionWrapper from "@/components/PermissionWrapper";

const PrdocutPage = () => {
  return (
    <PermissionWrapper
      allowedRoles={["Admin", "Editor"]}
      fallback={<p className="accessDenied">Only Admin & Editor Access</p>}
    >
      <ProductsPage />
    </PermissionWrapper>
  );
};

export default PrdocutPage;

export function generateMetadata() {
  return { title: "Products" };
}
