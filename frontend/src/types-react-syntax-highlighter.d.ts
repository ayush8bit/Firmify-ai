declare module "react-syntax-highlighter" {
  import { ComponentType, ReactNode } from "react";

  export type SyntaxHighlighterProps = {
    language?: string;
    style?: unknown;
    customStyle?: Record<string, string | number>;
    showLineNumbers?: boolean;
    children?: ReactNode;
  };

  export const Prism: ComponentType<SyntaxHighlighterProps>;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const oneDark: Record<string, unknown>;
}
