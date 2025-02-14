import type { Meta, StoryObj, ReactRenderer } from "@storybook/react";
import { PartialStoryFn } from "@storybook/types";

import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "../table";

import { Button, buttonVariants } from "./Button";
import { Loader } from "../loader";
import { LinkButton } from "./LinkButton";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: {
        type: "select",
      },
      options: ["contained", "light", "outlined", "text", "ghost"],
    },
    size: {
      control: {
        type: "select",
      },
      options: ["small", "medium", "large"],
    },
    color: {
      control: {
        type: "select",
      },
      options: ["yellow", "gray", "red", "orange", "green", "blue"],
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ] as ((story: PartialStoryFn<ReactRenderer, any>) => JSX.Element)[],
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    variant: "contained",
    size: "medium",
    color: "yellow",
    children: "My button",
    loading: undefined,
    disabled: false,
    selected: false,
    withRipple: false,
  },
};

const variants = ["contained", "light", "outlined", "text", "ghost"] as const;
const colors = ["yellow", "gray", "red", "orange", "green", "blue"] as const;

export const Context = () => {
  return (
    <div>
      <h3 className="sb-h3">Sizes</h3>
      <div className="flex items-center gap-2">
        <Button size="small">small</Button>
        <Button size="medium">medium</Button>
        <Button size="large">large</Button>
      </div>
      <h3 className="sb-h3">Variants</h3>
      <div className="flex gap-2">
        <Button variant="contained">solid</Button>
        <Button variant="light">light</Button>
        <Button variant="outlined">outlined</Button>
        <Button variant="text">text</Button>
        <Button variant="ghost">ghost</Button>
      </div>
      <h3 className="sb-h3">States</h3>
      <div className="flex items-center gap-2">
        <Button disabled={true}>disabled</Button>
        <Button loading={false}>isLoading false</Button>
        <Button loading={true}>isLoading true</Button>
      </div>
      <h3 className="sb-h3">As child</h3>
      <div className="flex items-center gap-2">
        <Button variant="contained" color="gray" asChild>
          <a>as link</a>
        </Button>
        <Button variant="light" color="gray" asChild>
          <a>as link</a>
        </Button>
        <Button variant="outlined" color="gray" asChild>
          <a>as link</a>
        </Button>
        <Button variant="text" color="gray" asChild>
          <a>as link</a>
        </Button>
        <Button variant="ghost" color="gray" asChild>
          <a>as link</a>
        </Button>
      </div>
      <h3 className="sb-h3">Icons</h3>
      <div className="mb-4 flex items-center gap-4">
        <Button icon variant="contained" color="gray">
          <i className="fe-cancel"></i>
        </Button>
        <Button icon variant="outlined" color="gray">
          <i className="fe-cancel"></i>
        </Button>
        <Button icon variant="text" color="gray">
          <i className="fe-cancel"></i>
        </Button>
        <Button icon variant="ghost" color="gray">
          <i className="fe-cancel"></i>
        </Button>
        <Button variant="contained" color="gray" icon>
          <i className="fe-cancel"></i>
          <span>Cancel</span>
        </Button>
        <Button icon color="gray" loading={true}>
          <i className="fe-cancel"></i>
        </Button>
        <Button icon color="gray" disabled={true}>
          <Loader color="gray" />
        </Button>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <Button icon variant="contained">
          <i className="fe-cancel"></i>
        </Button>
        <Button icon variant="outlined">
          <i className="fe-cancel"></i>
        </Button>
        <Button icon variant="text">
          <i className="fe-cancel"></i>
        </Button>
        <Button icon variant="ghost">
          <i className="fe-cancel"></i>
        </Button>
        <Button variant="contained" icon>
          <i className="fe-cancel"></i>
          <span>Cancel</span>
        </Button>
        <Button icon color="yellow" loading={true}>
          <i className="fe-cancel"></i>
        </Button>{" "}
        <Button icon color="yellow" disabled={true}>
          <Loader color="yellow" />
        </Button>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <Button icon variant="contained" color="gray" size="small">
          <i className="fe-cancel text-body-sm"></i>
        </Button>
        <Button icon variant="contained" color="gray" size="medium">
          <i className="fe-cancel"></i>
        </Button>
        <Button icon variant="contained" color="gray" size="large">
          <i className="fe-cancel text-body-2xl"></i>
        </Button>
        <Button
          icon
          variant="contained"
          color="gray"
          size="custom"
          className="h-(--h-button) justify-center rounded-full [--h-button:6rem]"
        >
          <i className="fe-cancel text-body-3xl"></i>
        </Button>
      </div>
      <h3 className="sb-h3">Custom</h3>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Button size="custom" className="rounded-2xl">
          Text without margin
        </Button>
        <Button size="custom" className="rounded-2xl p-4">
          Text with margin
        </Button>
        <Button size="custom" className="rounded-2xl p-4">
          Long text
          <br /> with multiple
          <br />
          lines
        </Button>
        <Button icon size="small">
          <img src="/profil.jpg" width={200} height={200} className="rounded-full" />
        </Button>
        <Button icon size="medium">
          <img src="/profil.jpg" width={200} height={200} className="rounded-full" />
        </Button>
        <Button icon color="gray" size="small">
          <img src="/profil.jpg" width={200} height={200} className="rounded-full p-0.5" />
        </Button>
        <Button icon color="gray" size="medium">
          <img src="/profil.jpg" width={200} height={200} className="rounded-full p-1" />
        </Button>
        <Button icon color="gray" variant="text" size="medium">
          <img src="/profil.jpg" width={200} height={200} className="rounded-full p-1" />
        </Button>
        <Button icon color="gray" variant="text" size="large">
          <img src="/profil.jpg" width={200} height={200} className="rounded-full p-1" />
        </Button>
      </div>
      <h3 className="sb-h3">Class only</h3>
      <div className="mb-4 flex items-center gap-4">
        <div className={buttonVariants()} data-color="yellow" tabIndex={0}>
          simple &lt;div&gt;
        </div>
        <button className={buttonVariants()} data-color="gray">
          simple &lt;button&gt;
        </button>
      </div>
      <h3 className="sb-h3">LinkButton</h3>
      <div className="mb-4 flex items-center gap-4">
        <LinkButton href="#">simple &lt;a&gt;</LinkButton>
      </div>

      <h3 className="sb-h3">Default state</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>
              <></>
            </TableHeaderCell>
            {colors.map((color) => (
              <TableHeaderCell key={color}>{color}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((variant) => (
            <TableRow key={variant}>
              <TableCell>{variant}</TableCell>
              {colors.map((color) => (
                <TableCell key={color} label={color}>
                  <div className="flex gap-2">
                    <Button variant={variant} color={color}>
                      Lorem
                    </Button>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <h3 className="sb-h3">Only Selected state</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>
              <></>
            </TableHeaderCell>
            {colors.map((color) => (
              <TableHeaderCell key={color}>{color}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((variant) => (
            <TableRow key={variant}>
              <TableCell>{variant}</TableCell>
              {colors.map((color) => (
                <TableCell key={color} label={color}>
                  <div className="flex gap-2">
                    <Button selected variant={variant} color={color}>
                      Lorem
                    </Button>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
