import { memo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Board({ children }: Props) {
  return <div className="flex justify-center gap-4 h-[480px]">{children}</div>;
}

export default memo(Board);
