import PermissionWrapper from "@/components/PermissionWrapper";
import POSPage from "./template"

const Pos = () => {
  return (
    <PermissionWrapper
      allowedRoles={["Admin", "Editor"]}
      fallback={<p className="accessDenied">Only Admin & Editor Access</p>}
    >

      <POSPage />;
    </PermissionWrapper>

  )
};

export default Pos;
