/** Original site mascot: a round, stretchy creature with the vol smile drawn on its belly. */
export function Mascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false">
      <g className="mascot-root">
        <ellipse cx="150" cy="365" rx="42" ry="20" fill="#e0a800" />
        <ellipse cx="250" cy="365" rx="42" ry="20" fill="#e0a800" />
        <g className="mascot-arm-l">
          <path d="M92 215 C60 225 42 245 34 268" fill="none" stroke="#e0a800" strokeWidth="26" strokeLinecap="round" />
        </g>
        <g className="mascot-arm-r">
          <path d="M308 215 C340 225 358 245 366 268" fill="none" stroke="#e0a800" strokeWidth="26" strokeLinecap="round" />
        </g>
        <path d="M172 62 C164 38 150 28 134 26" fill="none" stroke="#e0a800" strokeWidth="11" strokeLinecap="round" />
        <path d="M228 62 C236 38 250 28 266 26" fill="none" stroke="#e0a800" strokeWidth="11" strokeLinecap="round" />
        <circle cx="132" cy="26" r="10" fill="#ff5a4f" />
        <circle cx="268" cy="26" r="10" fill="#ff5a4f" />
        <g className="mascot-belly">
          <ellipse cx="200" cy="218" rx="158" ry="156" fill="#ffd23f" />
          <ellipse cx="200" cy="262" rx="112" ry="100" fill="#fff0b3" />
          <path d="M120 240 C150 330 250 330 280 240" fill="none" stroke="#ff5a4f" strokeWidth="6" strokeLinecap="round" />
          <circle cx="200" cy="307" r="6" fill="#ff5a4f" />
        </g>
        <ellipse className="mascot-eye" cx="158" cy="118" rx="15" ry="19" fill="#0a0a0c" />
        <ellipse className="mascot-eye" cx="242" cy="118" rx="15" ry="19" fill="#0a0a0c" />
        <ellipse className="mascot-mouth" cx="200" cy="170" rx="30" ry="9" fill="#0a0a0c" />
        <text className="mascot-zzz" x="300" y="70" fontFamily="monospace" fontSize="44" fontWeight="700" fill="#f3f1ea" opacity="0">z</text>
      </g>
    </svg>
  );
}
