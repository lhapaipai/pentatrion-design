import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { validateUrl } from "../utils/url";

type Props = {
  hasLinkAttributes?: boolean;
};

export function CustomLinkPlugin({ hasLinkAttributes = false }: Props) {
  return (
    <LexicalLinkPlugin
      validateUrl={validateUrl}
      attributes={
        hasLinkAttributes
          ? {
              rel: "noopener noreferrer",
              target: "_blank",
            }
          : undefined
      }
    />
  );
}
