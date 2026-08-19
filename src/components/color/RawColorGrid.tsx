import clsx from "clsx";
import { colorByGroups } from "../../lib/color";

interface Props {
  value: string | null;
  onChange: (color: string) => void;
}

export function RawColorGrid({ value, onChange }: Props) {
  return (
    <div className="grid-cols-repeat-fill-50 grid gap-1 text-center text-sm p-2">
      {colorByGroups.map(({ name, colors }) => (
        <div key={name}>
          <div className="text-body-xs truncate">{name}</div>
          <div className="grid shadow">
            {colors.map(([colorNumber, colorCode]) => (
              <button
                key={colorNumber}
                className={clsx(
                  "cursor-pointer first-of-type:rounded-t-md last-of-type:rounded-b-md",
                  parseInt(colorNumber) > 600 ? "text-white" : "text-black",
                  "hover:z-20 hover:scale-125 hover:rounded hover:shadow active:scale-125",
                  value === colorCode &&
                    "outline-yellow-5 z-10 rounded outline-2 -outline-offset-1",
                )}
                style={{ backgroundColor: colorCode }}
                onClick={() => onChange(colorCode)}
              >
                {colorNumber}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
