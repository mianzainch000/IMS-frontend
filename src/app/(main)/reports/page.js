import React from "react";
import ProfitLossPage from "./template";
import PermissionWrapper from "@/components/PermissionWrapper";

const Report = () => {
  return (
    <PermissionWrapper
      allowedRoles={["Admin"]}
      fallback={<p className="accessDenied">Only Admin Access</p>}
    >
      <ProfitLossPage />
    </PermissionWrapper>
  );
};

export default Report;
