export type Message = {
  content: string;
} & Required<ToastOptions>;

export type MessageInput = {
  content: string;
} & ToastOptions;

export type ToastOptions = {
  color?: "yellow" | "gray" | "red" | "orange" | "green" | "blue";
  id?: string;
  expiration?: number;
  canClose?: boolean;
  withLoader?: boolean;
};
