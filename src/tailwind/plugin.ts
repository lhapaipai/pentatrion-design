import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";
/**
 * configuration par défaut
 * https://github.com/tailwindlabs/tailwindcss/blob/main/stubs/config.full.js
 */

export const pentatrionTw = plugin(
  ({ addVariant }) => {
    // addVariant("active-full", ["&:active", "&.active"]);

    /**
     *  aria-[checked=true]:bg-[rgb(var(--color-custom-3))] aria-[current]:bg-[rgb(var(--color-custom-3))] has-[:checked]:bg-[rgb(var(--color-custom-3))]
     */
    addVariant("current", [`&[aria-checked="true"]`, `&[aria-current="page"]`, `&:has(:checked)`]);

    addVariant("focus-visible-has", ["&:focus-visible", "&:has(:focus)", "&:has(:active)"]);
    // dbl :focus:focus else :hover will have priority to focus-full variant.
    addVariant("focus-full", ["&:has(input:focus)", "&.focus", "&:focus:focus"]);
  },
  {
    theme: {
      zIndex: {
        auto: "auto",
        0: "0",
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        dialog: "100",
        overlay: "100",
        tooltip: "100",
        "context-menu": "90",
        notification: "80",
      },
      transitionDuration: {
        ...defaultTheme.transitionDuration,
        DEFAULT: "200ms",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: "rgb(var(--color-black) / <alpha-value>)",
        white: "rgb(var(--color-white) / <alpha-value>)",

        yellow: {
          1: "rgb(var(--color-yellow-1) / <alpha-value>)",
          2: "rgb(var(--color-yellow-2) / <alpha-value>)",
          3: "rgb(var(--color-yellow-3) / <alpha-value>)",
          4: "rgb(var(--color-yellow-4) / <alpha-value>)",
          5: "rgb(var(--color-yellow-5) / <alpha-value>)",
          // color of the text when bg is yellow 3
          text: "rgb(var(--color-yellow-text) / <alpha-value>)",
        },
        green: {
          1: "rgb(var(--color-green-1) / <alpha-value>)",
          2: "rgb(var(--color-green-2) / <alpha-value>)",
          3: "rgb(var(--color-green-3) / <alpha-value>)",
          4: "rgb(var(--color-green-4) / <alpha-value>)",
          5: "rgb(var(--color-green-5) / <alpha-value>)",
          // color of the text when bg is green
          text: "rgb(var(--color-green-text) / <alpha-value>)",
        },
        blue: {
          1: "rgb(var(--color-blue-1) / <alpha-value>)",
          2: "rgb(var(--color-blue-2) / <alpha-value>)",
          3: "rgb(var(--color-blue-3) / <alpha-value>)",
          4: "rgb(var(--color-blue-4) / <alpha-value>)",
          5: "rgb(var(--color-blue-5) / <alpha-value>)",
          // color of the text when bg is blue
          text: "rgb(var(--color-blue-text) / <alpha-value>)",
        },
        orange: {
          1: "rgb(var(--color-orange-1) / <alpha-value>)",
          2: "rgb(var(--color-orange-2) / <alpha-value>)",
          3: "rgb(var(--color-orange-3) / <alpha-value>)",
          4: "rgb(var(--color-orange-4) / <alpha-value>)",
          5: "rgb(var(--color-orange-5) / <alpha-value>)",
          // color of the text when bg is orange
          text: "rgb(var(--color-orange-text) / <alpha-value>)",
        },
        red: {
          1: "rgb(var(--color-red-1) / <alpha-value>)",
          2: "rgb(var(--color-red-2) / <alpha-value>)",
          3: "rgb(var(--color-red-3) / <alpha-value>)",
          4: "rgb(var(--color-red-4) / <alpha-value>)",
          5: "rgb(var(--color-red-5) / <alpha-value>)",
          // color of the text when bg is red
          text: "rgb(var(--color-red-text) / <alpha-value>)",
        },
        gray: {
          0: "rgb(var(--color-gray-0) / <alpha-value>)",
          1: "rgb(var(--color-gray-1) / <alpha-value>)",
          2: "rgb(var(--color-gray-2) / <alpha-value>)",
          3: "rgb(var(--color-gray-3) / <alpha-value>)",
          4: "rgb(var(--color-gray-4) / <alpha-value>)",
          5: "rgb(var(--color-gray-5) / <alpha-value>)",
          6: "rgb(var(--color-gray-6) / <alpha-value>)",
          7: "rgb(var(--color-gray-7) / <alpha-value>)",
          8: "rgb(var(--color-gray-8) / <alpha-value>)",
          // color of the text when bg is gray
          text: "rgb(var(--color-gray-text) / <alpha-value>)",
        },
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.1)",
        "sm-active": "0 0px 2px 0 rgb(0 0 0 / 0.1)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.15), 0 1px 2px -1px rgb(0 0 0 / 0.15)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.15), 0 2px 4px -2px rgb(0 0 0 / 0.15)",
        "md-active": "0 3px 6px -1px rgb(0 0 0 / 0.15), 0 1px 4px -2px rgb(0 0 0 / 0.15)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -2px rgb(0 0 0 / 0.15)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.15)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.35)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.1)",
        dark: "0 0 0 1px rgb(var(--color-gray-2))",
        none: "none",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
        fontello: ["fontello"],
        serif: defaultTheme.fontFamily.serif,
        mono: defaultTheme.fontFamily.mono,
      },

      extend: {
        // https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
        backgroundSize: {
          full: "100%",
        },
        dropShadow: {
          arrow: "0 1px 3px rgb(var(--color-gray-3))",
        },
        transitionProperty: {
          "color-shadow":
            "color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow",
        },
        gridTemplateColumns: {
          "repeat-fill-300": "repeat(auto-fill, minmax(300px, 1fr))",
          "repeat-fill-200": "repeat(auto-fill, minmax(200px, 1fr))",

          /**
           * smartphone width: 375px
           * 0.5rem <1col> gap: 0.5rem <1col> 0.5rem
           * 1col = (375px - (1.5rem = 24px)) = 175.5px
           * on laisse une petite marge 170
           */
          "repeat-fill-170": "repeat(auto-fill, minmax(170px, 1fr))",
          "repeat-fit-170": "repeat(auto-fit, minmax(170px, 1fr))",
        },
        animation: {
          ripple: "ripple .9s linear",
          "fade-in": "fade-in 150ms ease both",
          "fade-in-list": "fade-in-list 150ms ease both",
          "fade-out": "fade-out 250ms ease both",
          "fade-in-opacity": "fade-in-opacity 250ms ease both",
          flash: "flash 1000ms ease both infinite",
          "loader-stroke": "loader-stroke 1s linear infinite",
        },
        fontSize: {
          /** 80px size / 84px high / bold */
          mega: ["5rem", { lineHeight: "5.25rem", fontWeight: "700" }],
          /** 56px size / 62px high / bold */
          h1: ["1.6rem", { lineHeight: "1.1", fontWeight: "700" }],
          /** 40px size / 48px high / bold */
          h2: ["1.4rem", { lineHeight: "1.3", fontWeight: "700" }],
          /** 32px size / 36px high / bold */
          h3: ["1.2rem", { lineHeight: "1.6", fontWeight: "700" }],
          /** 28px size / 36px high / bold */
          h4: ["1rem", { lineHeight: "1.5", fontWeight: "700" }],
          /** 24px size / 32px high / bold */
          h5: ["1rem", { lineHeight: "1.5", fontWeight: "700" }],
          /** 16px size / 20px high / bold */
          h6: ["1rem", { lineHeight: "1.5", fontWeight: "700" }],

          /** 32px size / 36px high / normal */
          "body-3xl": ["2rem", { lineHeight: "2.25rem" }],
          /** 32px size / 36px high / normal */
          "body-2xl": ["1.75rem", { lineHeight: "2.25rem" }],
          /** 28px size / 36px high / normal */
          "body-xl": ["1.5rem", { lineHeight: "2rem" }],
          /** 24px size / 32px high / normal */
          "body-lg": ["1.25rem", { lineHeight: "1.75rem" }],
          /** 20px size / 28px high / normal */
          "body-md": ["1.125rem", { lineHeight: "1.5rem" }],
          /** 16px size / 20px high / normal */
          "body-base": ["1rem", { lineHeight: "1.25rem" }],
          /** 14px size / 18px high / normal */
          "body-sm": ["0.875rem", { lineHeight: "1.125rem" }],
          /** 12px size / 16px high / normal */
          "body-xs": ["0.75rem", { lineHeight: "1rem" }],

          "body-2xs": ["0.688rem", { lineHeight: "1rem" }],
        },
        keyframes: {
          ripple: {
            to: {
              transform: "scale(4)",
              opacity: "0",
            },
          },
          "fade-in": {
            from: {
              transform: "scale(.8)",
              opacity: "0",
            },
            to: {
              transform: "scale(1)",
              opacity: "1",
            },
          },
          "fade-in-list": {
            from: {
              transform: "scaleY(.8)",
              opacity: "0",
            },
            to: {
              transform: "scaleY(1)",
              opacity: "1",
            },
          },
          "fade-out": {
            from: {
              transform: "scale(1)",
              opacity: "1",
            },
            to: {
              transform: "scale(.8)",
              opacity: "0",
            },
          },
          "fade-in-opacity": {
            from: {
              opacity: "0",
            },
            to: {
              opacity: "1",
            },
          },
          flash: {
            "0%": {
              opacity: "0",
            },
            "50%": {
              opacity: "1",
            },
            "100%": {
              opacity: "0",
            },
          },
          "loader-stroke": {
            from: {
              // check : packages/pentatrion-design/components/loader/Loader.tsx
              // for dashoffset value
              "stroke-dashoffset": "43.699",
            },
            to: {
              "stroke-dashoffset": "0",
            },
          },
        },
      },
    },
  },
);
