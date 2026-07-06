import rawColors from "tailwindcss/colors";

export const colorByGroups = Object.entries(rawColors)
  .filter(
    ([name, colorGroup]) =>
      // blueGray === slate
      // coolGray === gray
      // neutral === trueGray
      // stone === warmGray
      // ski === lightBlue
      typeof colorGroup !== "string" &&
      !["blueGray", "coolGray", "trueGray", "warmGray", "lightBlue"].includes(name),
  )
  .map(([name, colorGroup]) => ({
    name,
    colors: Object.entries(colorGroup) as [string, string][],
  }));
