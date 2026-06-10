import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

import styles from "./Layout.module.scss";

const Layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.main}>
        <Navbar />

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;