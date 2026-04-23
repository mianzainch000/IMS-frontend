import POSPage from "./template";
import PermissionWrapper from "@/components/PermissionWrapper";

const Pos = () => {
  return (
    <PermissionWrapper
      allowedRoles={["Admin", "Editor"]}
      fallback={<p className="accessDenied">Only Admin & Editor Access</p>}
    >
      <POSPage />
    </PermissionWrapper>
  );
};

export default Pos;

export function generateMetadata() {
  return { title: "POS" };
}
