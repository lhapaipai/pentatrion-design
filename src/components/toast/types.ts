import { ThemeBaseColor } from "../../types";

export type Message = {
  content: string;
} & Required<ToastOptions>;

export type MessageInput = {
  content: string;
} & ToastOptions;

export type ToastOptions = {
  color?: ThemeBaseColor;
  id?: string;
  expiration?: number;
  canClose?: boolean;
  withLoader?: boolean;
};
