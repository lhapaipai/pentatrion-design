import { Meta } from "@storybook/react";
import { useState } from "react";
import { Input } from "../input/Input";
import { useDraggableMonitor } from "./useDraggableMonitor";
import clsx from "clsx";
import { useDraggableItem } from "./useDraggableItem";
import { DropIndicator } from "./DropIndicator";
import { createPortal } from "react-dom";
import { dragStateStyles } from "./util";
import { Button } from "../button";

const meta = {
  title: "Components/Draggable",
  decorators: [(Story) => <Story />],
} satisfies Meta;
export default meta;

interface Post {
  id: number;
  name: string;
}

const initialPosts: Post[] = [
  { id: 0, name: "Rare Wind" },
  { id: 1, name: "Saint Petersburg" },
  { id: 2, name: "Deep Blue" },
  { id: 3, name: "Ripe Malinka" },
  { id: 4, name: "Near Moon" },
];

function PostCard({ post }: { post: Post }) {
  const { ref, state } = useDraggableItem({
    id: post.id,
    customPreview: true,
  });

  return (
    <>
      <div className="relative">
        <div
          className={clsx(
            "border-gray-2 hover:bg-gray-1 flex h-8 flex-row items-center rounded-2xl border border-solid bg-white pr-4 pl-0 text-sm hover:cursor-grab",
            dragStateStyles[state.type] ?? "",
          )}
          // Adding data-attribute as a way to query for this for our post drop flash
          data-item-id={post.id}
          ref={ref}
        >
          <div className="flex w-8 items-center justify-center">
            <i className="fe-vertical-grip"></i>
          </div>
          <span className="shrink grow truncate">
            {post.name} [{state.type}]
          </span>
        </div>
        {state.type === "is-dragging-over" && state.closestEdge ? (
          <DropIndicator edge={state.closestEdge} gap={"8px"} />
        ) : null}
      </div>
      {state.type === "preview"
        ? createPortal(
            <div className="border-gray-2 rounded-sm border border-solid bg-white p-2 text-sm">
              {post.name}
            </div>,
            state.container,
          )
        : null}
    </>
  );
}

export const Basic = () => {
  const [posts, setPosts] = useState(initialPosts);
  useDraggableMonitor({
    list: posts,
    onListChange: setPosts,
  });
  return (
    <div className="max-w-[420px]">
      <div className="flex flex-col gap-2 p-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

function InputCard({ post }: { post: Post }) {
  const { ref, state, refHandle } = useDraggableItem({
    id: post.id,
  });

  return (
    <div className="relative rounded-2xl" ref={ref} data-item-id={post.id}>
      <Input
        prefix={
          <Button variant="text" icon ref={refHandle} className="hover:cursor-grab" color="gray">
            <i className="fe-vertical-grip"></i>
          </Button>
        }
        className={clsx(dragStateStyles[state.type] ?? "")}
        defaultValue={post.name}
      />
      {state.type === "is-dragging-over" && state.closestEdge ? (
        <DropIndicator edge={state.closestEdge} gap={"8px"} />
      ) : null}
    </div>
  );
}

export const WithInputs = () => {
  const [posts, setPosts] = useState(initialPosts);
  useDraggableMonitor({
    list: posts,
    onListChange: setPosts,
  });
  return (
    <div className="">
      <div>Preserves the posts values even if they are not controlled</div>
      <div className="flex max-w-[420px] flex-col gap-2 p-2">
        {posts.map((post) => (
          <InputCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export const DropIndicatorContext = () => {
  return (
    <div className="flex max-w-96 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="border-gray-2 rounded-sm border border-solid bg-white p-2">Item 1</div>
        <div className="relative">
          <DropIndicator edge="top" gap="0.5rem" />
          <DropIndicator edge="bottom" gap="0.5rem" />
          <div className="border-gray-2 rounded-sm border border-solid bg-white p-2">Item 2</div>
        </div>
        <div className="border-gray-2 rounded-sm border border-solid bg-white p-2">Item 3</div>
      </div>
      <div className="flex gap-2">
        <div className="border-gray-2 h-12 flex-1 rounded-sm border border-solid bg-white p-2">
          Item 1
        </div>
        <div className="relative flex-1">
          <DropIndicator edge="left" gap="0.5rem" />
          <DropIndicator edge="right" gap="0.5rem" />
          <div className="border-gray-2 h-12 rounded-sm border border-solid bg-white p-2">
            Item 2
          </div>
        </div>
        <div className="border-gray-2 h-12 flex-1 rounded-sm border border-solid bg-white p-2">
          Item 3
        </div>
      </div>
    </div>
  );
};
