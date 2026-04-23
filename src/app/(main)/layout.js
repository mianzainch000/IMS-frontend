import { cookies } from "next/headers";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import styles from "@/css/DashboardLayout.module.css";

const DashboardLayout = async ({ children }) => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  let userData = { name: "User", role: "Viewer" };

  if (userCookie) {
    const parsedUser = JSON.parse(userCookie);
    userData = {
      name: `${parsedUser.firstName} ${parsedUser.lastName}`,
      role: parsedUser.role,
    };
  }
  return (
    <div className={styles.layout}>
      {}
      <Sidebar />

      {}
      <div className={styles.mainContainer}>
        {}
        <Header user={userData} />
        {}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
