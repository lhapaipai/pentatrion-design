import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}
