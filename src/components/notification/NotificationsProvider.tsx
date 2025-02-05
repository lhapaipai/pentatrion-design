import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  NotificationsContext,
  createNotificationsManager,
  type NotificationsManager,
} from "./NotificationsContext";
import { Snack } from "../snack/Snack";
import { Message } from "../../types";

interface Props {
  children: ReactNode;
}

export function NotificationsProvider({ children }: Props) {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const container = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const currentContainer = container.current;
    return () => {
      currentContainer?.remove();
    };
  }, []);

  const managerRef = useRef<NotificationsManager>(null!);

  if (!managerRef.current) {
    managerRef.current = createNotificationsManager(setNotifications);
  }

  const manager = managerRef.current;

  if (typeof window === "undefined") {
    return (
      <NotificationsContext.Provider value={manager}>{children}</NotificationsContext.Provider>
    );
  }

  if (!container.current) {
    container.current = document.createElement("div");
    container.current.id = Math.floor(Math.random() * 100000).toString();
    /* .ll-snack-bar */
    container.current.classList.add(
      "fixed",
      "bottom-0",
      "left-0",
      "right-0",
      "z-toast",
      "pointer-events-none",
    );
    document.body.append(container.current);
  }

  return (
    <>
      <NotificationsContext.Provider value={manager}>{children}</NotificationsContext.Provider>
      {createPortal(
        /* snack-bar-inner */
        <div className="mx-4 mb-4 flex flex-col items-center gap-4">
          {notifications.map((props) => (
            <Snack
              {...props}
              key={props.id}
              onRemove={() => manager.removeNotification(props.id)}
            />
          ))}
        </div>,
        container.current,
      )}
    </>
  );
}
