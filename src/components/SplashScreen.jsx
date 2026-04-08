import { useState, useMemo } from "react";
import styles from "./SplashScreen.module.css";

const ICONS = [
  { emoji: "\u{1F392}", cls: "icon1" },
  { emoji: "\u2708\uFE0F", cls: "icon2" },
  { emoji: "\u{1F9ED}", cls: "icon3" },
  { emoji: "\u26F0\uFE0F", cls: "icon4" },
  { emoji: "\u{1F30E}", cls: "icon5" },
  { emoji: "\u{1F3D5}\uFE0F", cls: "icon6" },
  { emoji: "\u{1F5FA}\uFE0F", cls: "icon7" },
  { emoji: "\u{1F32E}", cls: "icon8" },
];

export default function SplashScreen({ routeName, startDate, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  const daysUntil = useMemo(() => {
    const dep = new Date((startDate || "2026-06-08") + "T00:00:00");
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.max(0, Math.ceil((dep - now) / 86400000));
  }, [startDate]);

  const parts = (routeName || "Mexico \u2192 Patagonia").toUpperCase().split(/\s*(\u2192)\s*/);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onDismiss, 600);
  };

  const dateStr = new Date((startDate || "2026-06-08") + "T00:00:00")
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const ROUTE_STOPS = [
    "Mexico", "Guatemala", "Honduras", "Costa Rica",
    "Colombia", "Ecuador", "Peru", "Bolivia", "Chile", "Patagonia",
  ];

  return (
    <div className={`${styles.splash} ${exiting ? styles.exiting : ""}`}>
      <div className={styles.gradientBg} />
      <div className={styles.floatingIcons}>
        {ICONS.map((icon) => (
          <span key={icon.cls} className={`${styles.icon} ${styles[icon.cls]}`}>
            {icon.emoji}
          </span>
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.routeText}>
          {parts.map((part, i) => (
            <span
              key={i}
              className={part === "\u2192" ? styles.arrow : styles.word}
              style={{ animationDelay: `${0.3 + i * 0.3}s` }}
            >
              {part}
            </span>
          ))}
        </div>
        <div className={styles.routeTrail}>
          {ROUTE_STOPS.map((stop, i) => (
            <span key={stop}>
              <span
                className={`${styles.routeStop} ${i === 0 || i === ROUTE_STOPS.length - 1 ? styles.routeStopActive : ""}`}
              >
                {stop}
              </span>
              {i < ROUTE_STOPS.length - 1 && (
                <span className={styles.routeDots}>{" · · · "}</span>
              )}
            </span>
          ))}
        </div>
        <div className={styles.countdown}>
          <span className={styles.daysNumber}>{daysUntil}</span>
          <div className={styles.daysLabel}>days until departure</div>
        </div>
        <div className={styles.dateLine}>{dateStr}</div>
        <button className={styles.enterBtn} onClick={handleEnter}>
          Let's Go &rarr;
        </button>
      </div>
    </div>
  );
}
