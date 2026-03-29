import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { BioUser } from "./hooks/useAuth";

interface LoginPageProps {
  onLogin: (user: BioUser) => void;
}

// Floating biology particle
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  shape: "circle" | "helix" | "hexagon";
  opacity: number;
}

const PARTICLES: Particle[] = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 8 + Math.random() * 24,
  duration: 6 + Math.random() * 10,
  delay: Math.random() * 5,
  shape: (["circle", "helix", "hexagon"] as const)[i % 3],
  opacity: 0.06 + Math.random() * 0.12,
}));

function DNAIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 6 C16 6 20 14 24 14 C28 14 32 6 32 6"
        stroke="oklch(0.73 0.18 192)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 42 C16 42 20 34 24 34 C28 34 32 42 32 42"
        stroke="oklch(0.74 0.14 80)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M17.5 10 C17.5 10 20.5 18 24 18 C27.5 18 30.5 10 30.5 10"
        stroke="oklch(0.73 0.18 192)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M17.5 38 C17.5 38 20.5 30 24 30 C27.5 30 30.5 38 30.5 38"
        stroke="oklch(0.74 0.14 80)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <line
        x1="16"
        y1="6"
        x2="16"
        y2="42"
        stroke="oklch(0.73 0.18 192)"
        strokeWidth="2"
        strokeDasharray="2 3"
      />
      <line
        x1="32"
        y1="6"
        x2="32"
        y2="42"
        stroke="oklch(0.74 0.14 80)"
        strokeWidth="2"
        strokeDasharray="2 3"
      />
      <line
        x1="16"
        y1="24"
        x2="32"
        y2="24"
        stroke="oklch(0.73 0.18 192)"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <line
        x1="17"
        y1="18"
        x2="31"
        y2="18"
        stroke="oklch(0.73 0.18 192)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="17"
        y1="30"
        x2="31"
        y2="30"
        stroke="oklch(0.73 0.18 192)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <circle cx="16" cy="24" r="2.5" fill="oklch(0.73 0.18 192)" />
      <circle cx="32" cy="24" r="2.5" fill="oklch(0.74 0.14 80)" />
    </svg>
  );
}

function ParticleShape({
  shape,
  size,
  color,
}: { shape: string; size: number; color: string }) {
  if (shape === "hexagon") {
    const s = size / 2;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${s + s * Math.cos(angle)},${s + s * Math.sin(angle)}`;
    }).join(" ");
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <polygon points={pts} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  if (shape === "helix") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M4 2 C4 2 8 8 10 10 C12 12 16 18 16 18"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M16 2 C16 2 12 8 10 10 C8 12 4 18 4 18"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <circle
        cx="10"
        cy="10"
        r="7"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="10" cy="10" r="2.5" fill={color} />
    </svg>
  );
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const g = (window as any).google;
      if (!g) return;
      g.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: (response: any) => {
          // Decode JWT to get user info
          const payload = JSON.parse(atob(response.credential.split(".")[1]));
          onLogin({
            name: payload.name || "User",
            email: payload.email || "",
            picture: payload.picture,
          });
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      if (googleBtnRef.current) {
        g.accounts.id.renderButton(googleBtnRef.current, {
          theme: "filled_black",
          size: "large",
          width: 320,
          text: "continue_with",
          shape: "pill",
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [onLogin]);

  const handleGuest = () => {
    onLogin({ name: "Guest Explorer", email: "", isGuest: true });
  };

  const TEAL = "oklch(0.73 0.18 192)";
  const AMBER = "oklch(0.74 0.14 80)";

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "oklch(0.09 0.03 145)" }}
    >
      {/* Animated floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30 - p.size, 0],
            rotate: [0, 180, 360],
            opacity: [p.opacity, p.opacity * 1.8, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ParticleShape
            shape={p.shape}
            size={p.size}
            color={p.id % 2 === 0 ? TEAL : AMBER}
          />
        </motion.div>
      ))}

      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.73 0.18 192 / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div
          className="rounded-2xl border p-8 flex flex-col items-center gap-6"
          style={{
            background: "oklch(0.14 0.028 145)",
            borderColor: "oklch(0.26 0.03 145)",
            boxShadow:
              "0 0 60px oklch(0.73 0.18 192 / 0.12), 0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "oklch(0.73 0.18 192 / 0.12)",
                border: "1px solid oklch(0.73 0.18 192 / 0.3)",
              }}
            >
              <DNAIcon />
            </motion.div>

            <div className="text-center">
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: "oklch(0.93 0.018 145)",
                }}
              >
                BioViewer 3D
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "oklch(0.6 0.05 145)" }}
              >
                Explore the living world in 3D
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="w-full grid grid-cols-3 gap-2">
            {[
              { icon: "🧬", label: "DNA & RNA" },
              { icon: "🦴", label: "Anatomy" },
              { icon: "🦠", label: "Bacteria" },
            ].map((f) => (
              <div
                key={f.label}
                className="rounded-xl p-2 flex flex-col items-center gap-1 text-center"
                style={{ background: "oklch(0.18 0.024 145)" }}
              >
                <span className="text-lg">{f.icon}</span>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "oklch(0.7 0.04 145)" }}
                >
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-3">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.24 0.024 145)" }}
            />
            <span
              className="text-[11px]"
              style={{ color: "oklch(0.55 0.04 145)" }}
            >
              Sign in to explore
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.24 0.024 145)" }}
            />
          </div>

          {/* Google sign-in button container */}
          <div
            ref={googleBtnRef}
            className="w-full flex justify-center"
            data-ocid="login.google_button"
          />

          {/* Fallback manual Google button if SDK not loaded */}
          <button
            type="button"
            onClick={() =>
              onLogin({
                name: "Demo User",
                email: "demo@bioviewer.app",
                picture: undefined,
              })
            }
            className="w-full flex items-center justify-center gap-3 rounded-full py-3 px-5 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "oklch(0.22 0.022 145)",
              border: "1px solid oklch(0.28 0.026 145)",
              color: "oklch(0.88 0.018 145)",
            }}
            data-ocid="login.demo_button"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Guest button */}
          <button
            type="button"
            onClick={handleGuest}
            className="w-full rounded-full py-2.5 px-5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "transparent",
              border: "1px solid oklch(0.73 0.18 192 / 0.4)",
              color: "oklch(0.73 0.18 192)",
            }}
            data-ocid="login.guest_button"
          >
            Continue as Guest →
          </button>

          <p
            className="text-[10px] text-center"
            style={{ color: "oklch(0.5 0.03 145)" }}
          >
            No account required for guest access.
            <br />
            Sign in to save your exploration history.
          </p>
        </div>

        <p
          className="text-center text-[11px] mt-4"
          style={{ color: "oklch(0.45 0.03 145)" }}
        >
          © {new Date().getFullYear()} · Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.73 0.18 192)" }}
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
