import { CSSRuleObject } from "tailwindcss/types/config";

export const utilities: CSSRuleObject = {
  ".flex-center": {
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
  },
  "a.link": {
    "@apply decoration-gray-8 underline text-gray-8 visited:text-gray-8 active:text-yellow-4 hover:decoration-2 hover:decoration-yellow-4":
      {},
  },
};

export const utilitiesDialog: CSSRuleObject = {
  '[data-placement^="top"]': {
    transformOrigin: "bottom",
    "& .p8n-arrow": {
      "@apply w-0 h-0 absolute border-x-8 border-t-8 border-x-transparent border-t-current top-full drop-shadow-arrow dark:drop-shadow-[0_1px_0_rgb(var(--color-gray-2))]":
        {},
      clip: "rect(0px, 16px, 12px, 0px)",
    },
  },
  '[data-placement="top-start"]': { transformOrigin: "bottom left" },
  '[data-placement="top-end"]': { transformOrigin: "bottom right" },
  '[data-placement^="bottom"]': {
    transformOrigin: "top",
    "& .p8n-arrow": {
      "@apply w-0 h-0 absolute border-x-8 border-b-8 border-x-transparent border-b-current bottom-full drop-shadow-arrow dark:drop-shadow-[0_-1px_0_rgb(var(--color-gray-2))]":
        {},
      clip: "rect(-4px, 16px, 8px, 0px)",
    },
  },
  '[data-placement="bottom-start"]': { transformOrigin: "top left" },
  '[data-placement="bottom-end"]': { transformOrigin: "top right" },
  '[data-placement^="left"]': {
    transformOrigin: "right",
    "& .p8n-arrow": {
      "@apply w-0 h-0 absolute border-y-8 border-l-8 border-y-transparent border-l-current left-full drop-shadow-arrow dark:drop-shadow-[1px_0_0_rgb(var(--color-gray-2))]":
        {},
      clip: "rect(0px, 12px, 16px, 0px)",
    },
  },
  '[data-placement="left-start"]': { transformOrigin: "top right" },
  '[data-placement="left-end"]': { transformOrigin: "bottom right" },
  '[data-placement^="right"]': {
    transformOrigin: "left",
    "& .p8n-arrow": {
      "@apply w-0 h-0 absolute border-y-8 border-r-8 border-y-transparent border-r-current right-full drop-shadow-arrow dark:drop-shadow-[-1px_0_0_rgb(var(--color-gray-2))]":
        {},
      clip: "rect(0px, 8px, 16px, -4px)",
    },
  },
  '[data-placement="right-start"]': { transformOrigin: "top left" },
  '[data-placement="right-end"]': { transformOrigin: "bottom left" },
  '[data-placement][data-color="yellow"] .p8n-arrow': {
    "@apply text-gray-0": {},
  },
  '[data-placement][data-color="gray"] .p8n-arrow': {
    "@apply text-gray-0": {},
  },
  '[data-placement][data-color="red"] .p8n-arrow': {
    "@apply text-red-1": {},
  },
  '[data-placement][data-color="orange"] .p8n-arrow': {
    "@apply text-orange-1": {},
  },
  '[data-placement][data-color="blue"] .p8n-arrow': {
    "@apply text-blue-1": {},
  },
  '[data-placement][data-color="green"] .p8n-arrow': {
    "@apply text-green-1": {},
  },
  ".option[data-nested][data-open]:not([data-focus-inside])": {
    "@apply bg-gray-2": {},
  },
  ".option[data-focus-inside][data-open]": { "@apply bg-gray-1": {} },
};
