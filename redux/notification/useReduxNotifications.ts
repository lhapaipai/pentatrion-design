import { parseError } from "../../lib";
import { MessageOptions } from "../../types.d";

import { messageAdded } from "./notificationSlice";
import { useDispatch } from "react-redux";

export function useReduxNotifications() {
  const dispatch = useDispatch();

  const notify = (content: string, options?: MessageOptions) => {
    dispatch(messageAdded(content, options));
  };

  const notifyError = (err: unknown) => {
    const errorMessage = parseError(err);
    if (errorMessage) {
      dispatch(messageAdded(...errorMessage));
    } else {
      throw err;
    }
  };
  return {
    notify,
    notifyError,
  };
}
