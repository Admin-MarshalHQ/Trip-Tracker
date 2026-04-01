import { fmt } from "../utils/financial";
import styles from "./Header.module.css";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function Header({ target, routeName, startDate }) {
  return (
    <header className={styles.header}>
      <div className={styles.route}>{routeName || "My Trip"}</div>
      <h1 className={styles.title}>Trip savings tracker</h1>
      <div className={styles.subtitle}>
        Departure: {formatDate(startDate || "2026-06-08")} &middot; Target: {fmt(target)}
      </div>
    </header>
  );
}
