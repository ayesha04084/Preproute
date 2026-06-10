import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.userSection}>
        <div className={styles.avatar}>
          A
        </div>

        <div>
          <h4>Admin User</h4>
          <p>Administrator</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;