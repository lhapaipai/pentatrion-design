export default {
  title: "Styles/Themes",
};

export const TextColors = () => {
  const colors = ["gray", "yellow", "green", "blue", "orange", "red"];

  return (
    <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-8 sm:grid-cols-1">
      {colors.map((color) => (
        <div key={color}>
          <div className="text-body-sm font-semibold">{color}</div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-5">
            {[1, 2, 3, 4, 5].map((variant) => (
              <div className="">
                <div
                  className="h-10 w-10 rounded sm:w-full"
                  style={{ backgroundColor: `rgb(var(--color-${color}-${variant}))` }}
                ></div>
                <div className="px-0.5">
                  <div className="text-body-xs w-6 font-medium">{variant}</div>
                  <div className="text-body-xs font-mono">{`--color-${color}-${variant}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
