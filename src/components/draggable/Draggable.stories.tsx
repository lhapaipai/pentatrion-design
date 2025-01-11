import { Meta } from "@storybook/react";
import { useState } from "react";
import { Input } from "../input/Input";
import { useDraggableMonitor } from "./useDraggableMonitor";
import clsx from "clsx";
import { useDraggableItem } from "./useDraggableItem";
import { DropIndicator } from "./DropIndicator";
import { createPortal } from "react-dom";
import { dragStateStyles } from "./util";

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
            "flex flex-row items-center rounded border border-solid border-gray-2 bg-white p-2 pl-0 text-sm hover:cursor-grab hover:bg-gray-1",
            dragStateStyles[state.type] ?? "",
          )}
          // Adding data-attribute as a way to query for this for our post drop flash
          data-item-id={post.id}
          ref={ref}
        >
          <div className="flex w-6 justify-center">
            <i className="fe-vertical-grip"></i>
          </div>
          <span className="flex-shrink flex-grow truncate">{post.name}</span>
        </div>
        {state.type === "is-dragging-over" && state.closestEdge ? (
          <DropIndicator edge={state.closestEdge} gap={"8px"} />
        ) : null}
      </div>
      {state.type === "preview"
        ? createPortal(
            <div className="rounded border border-solid border-gray-2 bg-white p-2 text-sm">
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
    setList: setPosts,
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
  const { ref, state } = useDraggableItem({
    id: post.id,
  });

  return (
    <div className="relative">
      <div
        className={clsx(
          "flex flex-row items-center rounded border border-solid border-gray-2 bg-white p-2 pl-0 text-sm hover:cursor-grab hover:bg-gray-1",
          dragStateStyles[state.type] ?? "",
        )}
        // Adding data-attribute as a way to query for this for our post drop flash
        data-item-id={post.id}
        ref={ref}
      >
        <div className="flex w-6 justify-center">
          <i className="fe-vertical-grip"></i>
        </div>
        <Input className="flex-1" defaultValue={post.name} />
      </div>
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
    setList: setPosts,
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
