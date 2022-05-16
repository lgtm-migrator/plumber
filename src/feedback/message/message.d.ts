export type Sections = {
  config: MessageObject | null;
  general: MessageObject | null;
  commits: MessageObject | null;
  upstream: MessageObject | null;
  flags: MessageObject | null;
  ci: MessageObject | null;
  reviews: MessageObject | null;
};

interface MessageObject {
  title: string;
  body?: string | null;
  note?: string | null;
}
