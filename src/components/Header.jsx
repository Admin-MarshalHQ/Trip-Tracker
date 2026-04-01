import { fmt } from "../utils/financial";
import styles from "./Header.module.css";

export default function Header({ target }) {
  return (
    <header className={styles.header}>
      <div className={styles.route}>Mexico &rarr; Patagonia</div>
      <h1 className={styles.title}>Trip savings tracker</h1>
      <div className={styles.subtitle}>
        Departure: June 8, 2026 &middot; Target: {fmt(target)}
      </div>
    </header>
  );
}
