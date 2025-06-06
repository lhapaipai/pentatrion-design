import { StoryFn } from "@storybook/react-vite";
import { Code } from "../components/code/Code";

export default {
  title: "Styles",
  decorators: [(Story: StoryFn) => <Story />],
};

export const Shadow = () => {
  const shadows = [
    "shadow-xs",
    "shadow-sm",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "shadow-2xl",
    "shadow-inner",
  ];

  return (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        marginBottom: "2rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
      }}
    >
      {shadows.map((s) => (
        <div
          key={s}
          className={`${s} dark:shadow-dark`}
          style={{
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Code className="text-body-xs">.{s}</Code>
        </div>
      ))}
    </div>
  );
};
