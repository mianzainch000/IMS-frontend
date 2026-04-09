import PermissionWrapper from "@/components/PermissionWrapper";

import UsersPage from "./template"
const User = () => {

  return (

    <PermissionWrapper
      allowedRoles={["Admin"]}
      fallback={<p className="accessDenied">Only Admin Access</p>}
    >

      <UsersPage />
    </PermissionWrapper>

  )
};

export default User;
