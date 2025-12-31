export type ThemeColor =
  | "yellow"
  | "gray"
  | "red"
  | "orange"
  | "green"
  | "blue"
  | "yellow-alpha"
  | "gray-alpha";

export type ThemeBaseColor = "yellow" | "gray" | "red" | "orange" | "green" | "blue";

export type MessageOptions = Partial<Omit<Message, "content" | "id">>;

export interface Message {
  id: string;
  content: string;
  expiration: number; // in ms. if -1 never expire
  color: ThemeBaseColor;
  canClose: boolean;
  withLoader: boolean;
}
