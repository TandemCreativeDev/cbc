import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "clarks-orange": "#FEBC12",
        "clarks-red": "#C14627",
      },
      fontFamily: {
        jost: ["'Jost'", "sans-serif"],
        blanch: ["var(--font-blanch)"],
        damion: ["'Damion'", "cursive"],
        goudy: ["var(--font-goudy)"],
      },
      animation: {
        "spin-pulse": "spin-pulse 10s linear infinite",
        "flicker-1": "flicker 1.5s steps(2) infinite",
        "flicker-2": "flicker 2.1s steps(2) infinite 0.3s",
        "flicker-3": "flicker 1.8s steps(2) infinite 0.7s",
      },
      keyframes: {
        "spin-pulse": {
          "0%": { transform: "rotateY(0deg) scale(1)" },
          "50%": { transform: "rotateY(180deg) scale(0.95)" },
          "100%": { transform: "rotateY(360deg) scale(1)" },
        },
        flicker: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [
    function (api: PluginAPI) {
      api.addUtilities({
        ".transform-style-3d": {
          "transform-style": "preserve-3d",
        },
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
      });
    },
  ],
} satisfies Config;
