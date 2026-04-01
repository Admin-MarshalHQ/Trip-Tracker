import { useState, useEffect, useRef } from "react";
import styles from "./ConfirmDeleteButton.module.css";

export default function ConfirmDeleteButton({ onConfirm, ariaLabel, className, children }) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef(null);

  const handleClick = () => {
    if (confirming) {
      clearTimeout(timerRef.current);
      setConfirming(false);
      onConfirm();
    } else {
      setConfirming(true);
      timerRef.current = setTimeout(() => setConfirming(false), 3000);
    }
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${className || ""} ${confirming ? styles.confirming : ""}`}
      aria-label={confirming ? "Confirm deletion" : ariaLabel}
    >
      {confirming ? "Sure?" : children}
    </button>
  );
}
