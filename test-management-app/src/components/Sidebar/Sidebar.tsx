import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";

import logo from "../../assets/preproute logo.svg";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img
          src={logo}
          alt="logo"
          className={styles.logo}
        />
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? styles.activeLink
              : styles.link
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/create-test"
          className={({ isActive }) =>
            isActive
              ? styles.activeLink
              : styles.link
          }
        >
          Test Creation
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;