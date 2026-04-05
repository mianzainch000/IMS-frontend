import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import styles from "@/css/DashboardLayout.module.css";

const DashboardLayout = ({ children }) => {
    return (
        <div className={styles.layout}>
            {/* 1. Sidebar Left par fixed rahega */}
            <Sidebar />

            {/* 2. Right side wala container jisme Header aur Page Content hoga */}
            <div className={styles.mainContainer}>

                {/* 3. Header hamesha top par rahega */}
                <Header />

                {/* 4. Ye wo jagah hai jahan Home ya Products ka content load hoga */}
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;