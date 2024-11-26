import { Code } from "../components/code/Code";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "../components/table";
import { Content } from "./Content";

export default {
  title: "Styles/Typography",
};

export const TextSizes = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderCell>Usage</TableHeaderCell>
        <TableHeaderCell>Example</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4",
        "text-h5",
        "text-h6",
        "text-body-3xl",
        "text-body-2xl",
        "text-body-xl",
        "text-body-lg",
        "text-body-md",
        "text-body-base",
        "text-body-sm",
        "text-body-xs",
        "text-body-2xs",
      ].map((sizeClass) => {
        return (
          <TableRow key={sizeClass}>
            <TableCell label="Usage">
              <Code>{`.${sizeClass}`}</Code>
            </TableCell>
            <TableCell label="Example">
              <span className={sizeClass}>Lorem ipsum</span>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

export const Typography = () => (
  <div>
    <h1 className="text-3xl">With TailwinCSS Typography</h1>
    <div className="prose prose-neutral dark:prose-invert">
      <Content />
    </div>
    <hr />
    <h1 className="text-3xl">Without TailwindCSS Typography</h1>
    <Content />
  </div>
);
