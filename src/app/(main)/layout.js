import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import styles from "@/css/DashboardLayout.module.css";
import { cookies } from "next/headers";

const DashboardLayout = async ({ children }) => {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;
    let userData = { name: "User", role: "Viewer" };

    if (userCookie) {
        const parsedUser = JSON.parse(userCookie);
        userData = {
            name: `${parsedUser.firstName} ${parsedUser.lastName}`,
            role: parsedUser.role // Ye ab "Staff" hoga agar pehle set kiya tha
        };
    }
    return (
        <div className={styles.layout}>
            {/* 1. Sidebar Left par fixed rahega */}
            <Sidebar />

            {/* 2. Right side wala container jisme Header aur Page Content hoga */}
            <div className={styles.mainContainer}>

                {/* 3. Header hamesha top par rahega */}
                <Header user={userData} />
                {/* 4. Ye wo jagah hai jahan Home ya Products ka content load hoga */}
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;