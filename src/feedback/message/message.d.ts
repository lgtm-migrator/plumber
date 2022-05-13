export type Sections = {
  config: ?MessageObject;
  general: ?MessageObject;
  commits: ?MessageObject;
  upstream: ?MessageObject;
  flags: ?MessageObject;
  ci: ?MessageObject;
  reviews: ?MessageObject;
};

export interface MessageObject {
  title: string;
  body?: string;
  note?: string;
}
