import HomePage from "./template";
import PermissionWrapper from "@/components/PermissionWrapper";

const Dashboard = () => {
  return (
    <PermissionWrapper
      allowedRoles={["Admin", "Editor"]}
      fallback={<p className="accessDenied">Only Admin & Editor Access</p>}
    >
      <HomePage />
    </PermissionWrapper>
  );
};

export default Dashboard;
