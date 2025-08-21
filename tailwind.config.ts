/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        '2xs': "320px", // Extra small mobile devices
        '3xl': "1680px", // Extra large desktop
        '4xl': "1920px", // Ultra wide desktop
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }], // 8px with 13px base
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 10px with 13px base
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 11px with 13px base
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 13px base
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 15px with 13px base
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 16px with 13px base
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 19px with 13px base
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 24px with 13px base
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 29px with 13px base
        '5xl': ['3rem', { lineHeight: '1' }],           // 39px with 13px base
        '6xl': ['3.75rem', { lineHeight: '1' }],        // 49px with 13px base
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        eloity: {
          DEFAULT: "hsl(var(--eloity-primary))",
          primary: "hsl(var(--eloity-primary))",
          secondary: "hsl(var(--eloity-secondary))",
          accent: "hsl(var(--eloity-accent))",
          gradient: {
            from: "#7D5FFF", // Neon Bluish Purple
            to: "#2979FF", // Electrifying Blue
          },
          neutrals: {
            black: "#000000", // Jet Black
            white: "#FFFFFF", // Pure White
          },
          metallic: {
            gold: "#FFD700",
            silver: "#C0C0C0",
          },
          ui: {
            success: "#2ECC71",
            warning: "#F1C40F",
            danger: "#E74C3C",
            info: "#00E5FF",
          },
        },
        // Legacy softchat colors for gradual migration
        softchat: {
          DEFAULT: "hsl(var(--eloity-primary))",
          primary: "hsl(var(--eloity-primary))",
          accent: "hsl(var(--eloity-secondary))",
          600: "hsl(var(--eloity-primary))",
          700: "hsl(var(--eloity-secondary))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
