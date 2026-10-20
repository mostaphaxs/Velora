// Static zellige-style background: an eight-point star lattice in faint gold that
// frames the hero around the edges and fades out behind the centered text.
export function HeroBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-sand">
      <svg
        className="absolute inset-0 size-full text-gold-dark"
        style={{
          maskImage:
            "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 35%, rgb(0 0 0 / 0.5) 70%, black 100%)",
        }}
      >
        <defs>
          <pattern id="zellige" width="80" height="80" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45">
              {/* Eight-point star: two overlapping squares */}
              <rect x="24" y="24" width="32" height="32" />
              <path d="M40 17.4 62.6 40 40 62.6 17.4 40z" />
              <circle cx="40" cy="40" r="4" />
              {/* Lattice linking stars to the neighbouring tiles */}
              <path d="M40 17.4V0M62.6 40H80M40 62.6V80M17.4 40H0" />
              <path d="M24 24 4 4M56 24l20-20M56 56l20 20M24 56 4 76" />
              {/* Diamonds where four tiles meet */}
              <path d="M0-8 8 0 0 8-8 0zM80-8l8 8-8 8-8-8zM0 72l8 8-8 8-8-8zM80 72l8 8-8 8-8-8z" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zellige)" />
      </svg>

      {/* Soft light behind the headline */}
      <div className="absolute top-1/2 left-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory/70 blur-3xl" />
    </div>
  );
}
