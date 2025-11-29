/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            colors: {
                primary: "#F97316",     // Orange
                secondary: "#0F172A",   // Slate
                accent: "#FACC15",      // Yellow
                background: "#FAFAF9",  // Light background

                text: {
                    primary: "#1E293B",   // Slate 800
                    secondary: "#475569", // Slate 600
                    light: "#94A3B8",     // Slate 400
                },
            },

            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },

            animation: {
                float: "float 6s ease-in-out infinite",
                "fade-in": "fadeIn 0.5s ease-out forwards",
                "slide-up": "slideUp 0.5s ease-out forwards",
            },

            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },

    plugins: [],
};
