import { useEffect, useRef } from "react";
import { animateGauge, animateCount } from "../lib/animations";

// Zone colors for different score ranges
function getZoneColor(score) {
  if (score >= 0.75) return "#FF4D4D"; // high risk
  if (score >= 0.50) return "#F59E0B"; // medium risk
  if (score >= 0.30) return "#EAB308"; // watch
  return "#10B981"; // normal
}

export default function ScoreGauge({ score, color, size = 200, label = "PUMPRISK SCORE" }) {
  const circleRef  = useRef(null);
  const textRef    = useRef(null);

  const radius      = 68;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const validScore  = Math.max(0, Math.min(score ?? 0, 1));
  const targetOffset = circumference * (1 - validScore);

  // Use zone color if no explicit color passed
  const activeColor = color || getZoneColor(validScore);

  useEffect(() => {
    if (circleRef.current) {
      animateGauge(circleRef.current, targetOffset, circumference, 1500);
    }
    if (textRef.current) {
      animateCount(textRef.current, validScore, {
        decimals: 3,
        duration: 1500,
      });
    }
  }, [validScore, targetOffset, circumference]);

  // Generate tick marks
  const ticks = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360 - 90;
    const rad   = (angle * Math.PI) / 180;
    const outer = 88;
    const inner = i % 5 === 0 ? 80 : 83;
    return {
      x1: 90 + inner * Math.cos(rad),
      y1: 90 + inner * Math.sin(rad),
      x2: 90 + outer * Math.cos(rad),
      y2: 90 + outer * Math.sin(rad),
      major: i % 5 === 0,
      filled: (i / 20) <= validScore,
    };
  });

  return (
    <div
      className="relative flex shrink-0 flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 180 180"
        className="-rotate-90 transform"
      >
        <defs>
          <filter id="gaugeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer boundary ring */}
        <circle
          cx="90" cy="90" r="86"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />

        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.filled ? `${activeColor}80` : "rgba(255,255,255,0.07)"}
            strokeWidth={t.major ? 2 : 1}
            strokeLinecap="round"
          />
        ))}

        {/* Background track */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Animated active arc */}
        <circle
          ref={circleRef}
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          filter="url(#gaugeGlow)"
        />

        {/* Inner decorative ring */}
        <circle
          cx="90" cy="90" r={radius - 16}
          fill="none"
          stroke={`${activeColor}10`}
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      </svg>

      {/* Center text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          ref={textRef}
          className="font-mono font-extrabold tracking-tight text-white drop-shadow-lg"
          style={{ fontSize: size * 0.2 }}
        >
          {(validScore || 0).toFixed(3)}
        </span>
        <span
          className="mt-1 font-mono font-semibold tracking-widest text-slate-500"
          style={{ fontSize: size * 0.054 }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
