import { CSSRuleObject } from "tailwindcss/types/config";

export const layout: CSSRuleObject = {
  html: {
    "font-size": "16px",
    "line-height": "24px",
    "color-scheme": "normal",
  },

  body: {
    "@apply bg-gray-0 font-sans text-gray-7": {},
  },

  ".light": {
    colorScheme: "light",
  },
};

export const base: CSSRuleObject = {
  ":focus-visible": {
    "@apply rounded outline outline-2 outline-offset-2 outline-yellow-5": {},
  },

  "textarea:read-only": {
    "@apply bg-gray-1": {},
  },

  'input[type="search"]::-webkit-search-cancel-button, input[type="search"]::-webkit-search-decoration, input[type="search"]::-webkit-search-results-button, input[type="search"]::-webkit-search-results-decoration':
    {
      display: "none",
    },

  'input[type="range"]': {
    backgroundColor: "transparent",
    "-webkit-appearance": "none",
    appearance: "none",
  },
  'input[type="range"]::-webkit-slider-thumb': {
    "-webkit-appearance": "none",
    appearance: "none",

    border: "0",
    boxSizing: "border-box",
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative",
  },
  'input[type="range"]::-moz-range-thumb': {
    appearance: "none",
    border: "0",
    boxSizing: "border-box",
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative",
  },
  'input[type="range"]::-ms-thumb': {
    appearance: "none",
    border: "0",
    boxSizing: "border-box",
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative",
  },

  mark: {
    "@apply bg-yellow-1 text-gray-8": {},
  },

  abbr: {
    "@apply cursor-help underline decoration-dashed": {},
  },

  '[data-color="yellow"]': {
    "--color-custom-1": "var(--color-yellow-1);",
    "--color-custom-2": "var(--color-yellow-2);",
    "--color-custom-3": "var(--color-yellow-3);",
    "--color-custom-4": "var(--color-yellow-4);",
    "--color-custom-5": "var(--color-yellow-5);",
  },
  '[data-color="gray"]': {
    "--color-custom-1": "var(--color-gray-1);",
    "--color-custom-2": "var(--color-gray-2);",
    "--color-custom-3": "var(--color-gray-3);",
    "--color-custom-4": "var(--color-gray-4);",
    "--color-custom-5": "var(--color-gray-5);",
  },
  '[data-color="red"]': {
    "--color-custom-1": "var(--color-red-1);",
    "--color-custom-2": "var(--color-red-2);",
    "--color-custom-3": "var(--color-red-3);",
    "--color-custom-4": "var(--color-red-4);",
    "--color-custom-5": "var(--color-red-5);",
  },
  '[data-color="orange"]': {
    "--color-custom-1": "var(--color-orange-1);",
    "--color-custom-2": "var(--color-orange-2);",
    "--color-custom-3": "var(--color-orange-3);",
    "--color-custom-4": "var(--color-orange-4);",
    "--color-custom-5": "var(--color-orange-5);",
  },
  '[data-color="green"]': {
    "--color-custom-1": "var(--color-green-1);",
    "--color-custom-2": "var(--color-green-2);",
    "--color-custom-3": "var(--color-green-3);",
    "--color-custom-4": "var(--color-green-4);",
    "--color-custom-5": "var(--color-green-5);",
  },
  '[data-color="blue"]': {
    "--color-custom-1": "var(--color-blue-1);",
    "--color-custom-2": "var(--color-blue-2);",
    "--color-custom-3": "var(--color-blue-3);",
    "--color-custom-4": "var(--color-blue-4);",
    "--color-custom-5": "var(--color-blue-5);",
  },
};
