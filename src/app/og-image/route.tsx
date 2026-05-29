import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)',
        }}
      />

      {/* Logo area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 40,
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="80" height="80" rx="20" fill="rgba(255,255,255,0.2)" />
          <path
            d="M25 55 L40 25 L55 55 Z"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinejoin="round"
          />
          <circle cx="40" cy="45" r="6" fill="white" />
        </svg>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: 'white',
          textAlign: 'center',
          lineHeight: 1.2,
          marginBottom: 20,
          textShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        SVGShip
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center',
          maxWidth: 800,
          lineHeight: 1.4,
        }}
      >
        Professional SVG Resource Directory
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          maxWidth: 700,
          marginTop: 30,
          lineHeight: 1.5,
        }}
      >
        Free Icons · Illustrations · Vector Graphics · Animations
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
