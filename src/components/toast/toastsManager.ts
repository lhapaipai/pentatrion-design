import { Dispatch, SetStateAction } from "react";
import { parseError } from "../../lib";
import { ToastOptions, Message } from "./types";

class ToastsManager {
  protected setToasts: Dispatch<SetStateAction<Message[]>> | null = null;
  protected idx = 1;
  protected timeoutIds = new Map<string, any>();

  addDispatcher(setState: Dispatch<SetStateAction<Message[]>>) {
    this.setToasts = setState;
  }

  removeToast(id: string) {
    if (!this.setToasts) {
      return;
    }

    const timeoutId = this.timeoutIds.get(id);
    if (!timeoutId) {
      return;
    }
    clearTimeout(timeoutId);
    this.timeoutIds.delete(id);

    return this.setToasts((oldToasts) => {
      return oldToasts.filter(({ id: otherId }) => id !== otherId);
    });
  }

  addToast(content: string, options: ToastOptions = {}) {
    if (!this.setToasts) {
      return;
    }
    const { expiration = 5000, color = "yellow", canClose = true, withLoader = false } = options;

    const id = (this.idx++).toString();
    if (this.timeoutIds.has(id)) {
      throw new Error("toast already exists");
    }

    this.setToasts((oldToasts) => {
      const newToast: Message = {
        id,
        content,
        expiration,
        color,
        canClose,
        withLoader,
      };

      return [newToast, ...oldToasts];
    });

    this.timeoutIds.set(
      id,
      expiration === -1 ? -1 : setTimeout(() => this.removeToast(id), expiration),
    );

    return id;
  }

  notifyError(err: unknown) {
    const errorMessage = parseError(err);
    if (errorMessage) {
      addToast(...errorMessage);
    } else {
      throw err;
    }
  }
}

const manager = new ToastsManager();

const addToast = manager.addToast.bind(manager);
const removeToast = manager.removeToast.bind(manager);
const notifyError = manager.notifyError.bind(manager);

export { manager, addToast, removeToast, notifyError };
