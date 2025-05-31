import { HTMLProps, MouseEvent, RefObject } from "react";
import { Tooltip } from "./Tooltip";
import { SimpleTooltip } from "./SimpleTooltip";
import { ReactRenderer } from "@storybook/react-vite";
import { Button, ButtonProps } from "../button";
import { useDoubleCheck } from "../../hooks";
import { PartialStoryFn } from "storybook/internal/types";

export default {
  title: "Components/Tooltip",
  component: Tooltip,
  decorators: [(Story) => <Story />] as ((
    story: PartialStoryFn<ReactRenderer, any>,
  ) => React.JSX.Element)[],
};

interface BoxProps extends HTMLProps<HTMLDivElement> {
  ref?: RefObject<HTMLDivElement>;
}

function Box({ ref, ...props }: BoxProps) {
  return (
    <div
      ref={ref}
      className="flex-center bg-gray-2 h-[100px] w-[100px] shadow-lg"
      style={{
        margin: "100px",
      }}
      {...props}
    ></div>
  );
}

export const Basic = () => {
  return (
    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio neque dolorum soluta
        suscipit,&nbsp;
        <SimpleTooltip content="infos" placement="bottom">
          dessous
        </SimpleTooltip>
        &nbsp;aut unde provident? Optio ipsum provident unde! Nulla, dignissimos recusandae. Eveniet
        ut quam voluptatum accusantium aspernatur?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur sit amet consectetur sit amet consectetur sit amet
        consectetur sit amet consectetursit amet consectetur adipisicing elit. Distinctio neque
        dolorum soluta suscipit,&nbsp;
        <SimpleTooltip content="infos" placement="top">
          top
        </SimpleTooltip>
        &nbsp; aut unde provident? Optio ipsum provident unde! Nulla, dignissimos recusandae.
        Eveniet ut quam voluptatum accusantium aspernatur?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio neque dolorum soluta
        suscipit, sit amet consectetur&nbsp;
        <SimpleTooltip content="infos" placement="left">
          gauche
        </SimpleTooltip>
        &nbsp; aut unde provident? Optio ipsum provident unde! Nulla, dignissimos recusandae.
        Eveniet ut quam voluptatum accusantium aspernatur?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur sit amet consectetur sit amet consectetur adipisicing
        elit. Distinctio neque dolorum soluta suscipit, &nbsp;
        <SimpleTooltip content="infos" placement="right">
          droite
        </SimpleTooltip>
        &nbsp; aut unde provident? Optio ipsum provident unde! Nulla, dignissimos recusandae.
        Eveniet ut quam voluptatum accusantium aspernatur?
      </p>
      <SimpleTooltip color="yellow" placement="right-start" content="infos">
        <Button>hello</Button>
      </SimpleTooltip>

      <div className="grid-cols-repeat-fill-300 grid gap-8">
        <SimpleTooltip color="yellow" open={true} placement="right-start" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip open={true} placement="right" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip open={true} placement="right-end" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip color="yellow" open={true} placement="left-start" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip color="gray" open={true} placement="left" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip color="orange" open={true} placement="left-end" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip color="red" open={true} placement="top-start" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip color="blue" open={true} placement="top" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip color="green" open={true} placement="top-end" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip color="red" open={true} placement="bottom-start" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip open={true} placement="bottom" content="infos">
          <Box />
        </SimpleTooltip>
        <SimpleTooltip open={true} placement="bottom-end" content="infos">
          <Box />
        </SimpleTooltip>
      </div>
    </div>
  );
};

export const Context = () => {
  // @ts-ignore
  const dc = useDoubleCheck<ButtonProps>();

  function handleClick(e: MouseEvent) {
    console.log(e);
    if (e.defaultPrevented) {
      return;
    }
    console.log("delete !!");
  }

  return (
    <div className="px-8">
      <div>Double check</div>
      <SimpleTooltip color="red" placement="top" open={dc.doubleCheck} content="Êtes-vous sûr ?">
        <Button
          color="red"
          variant={dc.doubleCheck ? "light" : "text"}
          icon
          {...dc.getButtonProps({
            onClick: handleClick,
          })}
        >
          <i className="fe-trash"></i>
        </Button>
      </SimpleTooltip>
    </div>
  );
};

// export const Draggable = () => {
//   const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
//   const bind = useDrag(({ event, offset: [x, y] }) => {
//     event.preventDefault();
//     api.start({ x, y, immediate: true });
//   });
//   return (
//     <div className="container">
//       <SimpleTooltip content="infos" placement="top" open={true} color="yellow">
//         <animated.div
//           {...bind()}
//           className="flex-center h-[100px] w-[100px] bg-gray-2 shadow-lg"
//           style={{
//             x,
//             y,
//             cursor: "pointer",
//           }}
//         >
//           <span>Box</span>
//         </animated.div>
//       </SimpleTooltip>
//     </div>
//   );
// };
