import type { NextConfig } from "next";

// ============================================================================
// Security headers
// ============================================================================
// The app previously shipped with NO security headers at all. These are
// applied to every route via Next's built-in `headers()` (no middleware
// needed - this is a static/SPA-style site).
//
// Notes on the CSP:
//   - Next.js requires 'unsafe-inline' + 'unsafe-eval' for its own runtime
//     in production builds (React refresh / hydration bootstrap).
//   - style-src keeps 'unsafe-inline' because React and framer-motion set
//     inline styles (transform/width) at runtime.
//   - Only the image hosts actually used by next/image are allowlisted.
// ============================================================================
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs unsafe-inline + unsafe-eval for its runtime/hydration.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
      // React & framer-motion write inline styles at runtime.
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://me7aitdbxq.ufs.sh https://raw.githubusercontent.com",
      "font-src 'self' data:",
      // blob: is REQUIRED - the 3D lanyard loads kartu.glb and its textures
      // via blob: URLs. Without it three.js fails with
      // "GLTFLoader: Couldn't load texture blob:...".
      // media-src covers <audio>/<video>; worker-src for blob workers.
      "connect-src 'self' blob: data: https://*.supabase.co https://api.github.com",
      "media-src 'self' blob: data:",
      "worker-src 'self' blob:",
      // Clickjacking protection: nobody may frame this site.
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      // Only relevant without HTTPS, but harmless and future-proof.
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "me7aitdbxq.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to all routes.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
