import { useState } from "react";
import { Snack } from "pentatrion-design/snack";
import { Message } from "./types";

import { manager } from "./toastsManager";

export function Toasts() {
  const [toasts, setToasts] = useState<Message[]>([]);
  manager.addDispatcher(setToasts);

  return (
    <div className="z-toast pointer-events-none fixed bottom-0 left-0 right-0">
      <div className="mx-4 mb-4 flex flex-col items-center gap-4">
        {toasts.map((props) => (
          <Snack key={props.id} {...props} onRemove={() => manager.removeToast(props.id)} />
        ))}
      </div>
    </div>
  );
}
