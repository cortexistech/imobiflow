export function FlowPath({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 160" fill="none" aria-hidden className={className}>
      <path
        d="M-20 92 C 90 92, 130 28, 240 36 C 360 46, 380 128, 510 118 C 640 108, 660 24, 800 40 C 940 56, 960 128, 1100 112 C 1180 102, 1200 70, 1260 70"
        stroke="#F0C43C"
        strokeWidth="2"
        strokeDasharray="5 9"
      />
      <rect x="232" y="28" width="16" height="16" fill="#F0C43C" stroke="#141414" strokeWidth="2" transform="rotate(45 240 36)" />
      <rect x="502" y="110" width="16" height="16" fill="#F0C43C" stroke="#141414" strokeWidth="2" transform="rotate(45 510 118)" />
      <rect x="792" y="32" width="16" height="16" fill="#F0C43C" stroke="#141414" strokeWidth="2" transform="rotate(45 800 40)" />
      <rect x="1092" y="104" width="16" height="16" fill="#F0C43C" stroke="#141414" strokeWidth="2" transform="rotate(45 1100 112)" />
    </svg>
  );
}
