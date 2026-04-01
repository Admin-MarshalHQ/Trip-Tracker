import { COLORS } from "../constants/theme";

export default function ProgressRing({ pct, size = 110, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const color = pct >= 100 ? COLORS.green : pct >= 70 ? COLORS.orange : COLORS.red;
  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)" }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Savings progress toward target"
    >
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} opacity={0.08}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}/>
    </svg>
  );
}
