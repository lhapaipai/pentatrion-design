import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }

  namespace JSX {
    interface IntrinsicElements {
      "altcha-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        challengeurl?: string;
        maxnumber?: number;
        debug?: boolean;
        hidelogo?: boolean;
        hidefooter?: boolean;
        name?: string;
        style?: React.CSSProperties;
      };
    }
  }
}
