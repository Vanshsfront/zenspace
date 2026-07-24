export type Block =
  | { type: "heading"; level: "h2" | "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; caption?: string };
