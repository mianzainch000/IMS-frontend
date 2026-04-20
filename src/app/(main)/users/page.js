import UsersPage from "./template";
import PermissionWrapper from "@/components/PermissionWrapper";

const User = () => {
  return (
    <PermissionWrapper
      allowedRoles={["Admin"]}
      fallback={<p className="accessDenied">Only Admin Access</p>}
    >
      <UsersPage />
    </PermissionWrapper>
  );
};

export default User;

export function generateMetadata() {
  return { title: "Users" };
}
