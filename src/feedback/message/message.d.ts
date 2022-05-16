export type Sections = {
  config: ?MessageObject;
  general: ?MessageObject;
  commits: ?MessageObject;
  upstream: ?MessageObject;
  flags: ?MessageObject;
  ci: ?MessageObject;
  reviews: ?MessageObject;
};

interface MessageObject {
  title: string;
  body?: string;
  note?: string;
}
