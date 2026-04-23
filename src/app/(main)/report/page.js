import React from "react";
import ReportPagePage from "./template";
import PermissionWrapper from "@/components/PermissionWrapper";

const Report = () => {
  return (
    <PermissionWrapper
      allowedRoles={["Admin"]}
      fallback={<p className="accessDenied">Only Admin Access</p>}
    >
      <ReportPagePage />
    </PermissionWrapper>
  );
};

export default Report;

export function generateMetadata() {
  return { title: "Report" };
}
