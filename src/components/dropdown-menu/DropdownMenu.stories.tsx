import { Placement } from "@floating-ui/react-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from ".";
import { Meta } from "@storybook/react";
import { Option, Select } from "../select";

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;
export default meta;

export const Basic = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => console.log("Undo")}>Your profile</DropdownMenuItem>
      <DropdownMenuItem disabled>Settings</DropdownMenuItem>
      <DropdownMenuItem>Customize</DropdownMenuItem>
      <DropdownMenuItem>Info</DropdownMenuItem>
      <DropdownMenuItem>Sign out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const themeOptions: Option[] = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
];

export const Advanced = ({ placement }: { placement?: Placement }) => (
  <DropdownMenu placement={placement}>
    <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
    <DropdownMenuContent className="min-w-64">
      <div className="p-2 text-sm">
        <div className="font-semibold">lhapaipai</div>
        <div className="text-gray-5">info@domain.com</div>
      </div>
      <DropdownMenuItem onClick={() => console.log("Undo")}>Your profile</DropdownMenuItem>
      <DropdownMenuItem disabled className="flex justify-between">
        <span>Settings</span>
        <i className="fe-settings"></i>
      </DropdownMenuItem>
      <DropdownMenuItem>Customize</DropdownMenuItem>
      <DropdownMenuItem className="flex justify-between">
        <span>Info</span>
        <i className="fe-info"></i>
      </DropdownMenuItem>
      <span className="flex items-center justify-between p-2">
        <span>Thème</span>
        <Select variant="ghost" defaultValue="light" options={themeOptions} />
      </span>
      <div className="my-2 h-0.5 bg-gray-1"></div>
      <DropdownMenuItem className="flex justify-between">
        <span>Sign out</span>
        <i className="fe-logout"></i>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const Context = () => (
  <header className="flex items-center gap-2 p-4">
    <div>Logo</div>
    <Advanced placement="bottom-start" />
    <div className="flex-1"></div>
    <Advanced placement="bottom-end" />
  </header>
);
