import { memo, RefObject } from "react";
import { Person } from "../types";

type CardPrimitiveProps = {
  // closestEdge: Edge | null;
  item: Person;
  // state: State;
  // actionMenuTriggerRef?: Ref<HTMLButtonElement>;
  ref?: RefObject<HTMLDivElement>;
};

function CardPrimitive({ item, ref }: CardPrimitiveProps) {
  const { avatarUrl, name, role } = item;

  return (
    <div
      ref={ref}
      className="border-gray-2 hover:bg-gray-1 relative box-border grid cursor-grab grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg border bg-white p-2 shadow-xs"
    >
      <div className="relative inline-block">
        <div className="pointer-events-none">
          <img className="h-10 w-10 rounded-full" src={avatarUrl} />
        </div>
      </div>

      <div className="box-border flex flex-col justify-stretch gap-1">
        <span className="text-h5 font-bold">{name}</span>
        <small className="text-xs">{role}</small>
      </div>
      <div className="box-border">...</div>
    </div>
  );
}

export const Card = memo(function Card({ item }: { item: Person }) {
  return (
    <>
      <CardPrimitive item={item} />
    </>
  );
});
