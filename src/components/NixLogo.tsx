export function NixLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 141.63 122.88"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M31.09 18.88L52.87 56.6l7.29-12.42-14.5-25.3h14.7l7.4 12.87 3.63-6.34 3.66-6.53H61.2L47.6 0 31.09 18.88z"
          fill="#7eb1d4"
        />
        <path
          d="M71.58 0h43.54l-7.29 12.42H79.11l-7.4 12.88-3.63-6.34L64.42 12.42h13.85L71.58 0z"
          fill="#5277c3"
        />
        <path
          d="M119.69 28.56l-21.78 37.72 14.58 0-14.5-25.3 7.35-12.75 7.4 12.87 3.66-6.53-3.63-6.34 6.93-12.09 13.6 18.56-5.61 12.42z"
          fill="#7eb1d4"
        />
        <path
          d="M141.63 50.28v43.54l-14.58 0 14.46-25.19-7.35-12.75-3.66 6.53-3.63 6.34V54.91l-6.68-12.42L138 28.56l3.63 21.72z"
          fill="#5277c3"
        />
        <path
          d="M110.54 104l-21.78-37.72-14.58.01 14.5 25.3-7.35 12.75-7.4-12.88H80.7l-3.38 12.42 6.45 18.99 17.33-5.15-4.71-12.42h14.16z"
          fill="#7eb1d4"
        />
        <path
          d="M70.05 122.88H26.51l7.29-12.42h28.72l7.35-12.75 3.66 6.53 3.63 6.34H63.31l6.68 12.42-13.54-4.63 13.6 4.51z"
          fill="#5277c3"
        />
        <path
          d="M21.94 94.32l21.78-37.72-14.58 0L14.64 81.9l-7.35 12.75L0 81.78l-3.66 6.53 3.63 6.34-6.93 12.09L6.64 88.18 21.94 94.32z"
          fill="#7eb1d4"
          transform="translate(7, 0)"
        />
      </g>
    </svg>
  );
}

export function AnimatedSnowflake() {
  return (
    <span className="inline-block animate-pulse-glow text-2xl" role="img" aria-label="snowflake">
      ❄️
    </span>
  );
}
