export type CommitObject = {
  hash: string;
  message: string;
  title?: string;
  bugRef?: BugRef;
};

export type BugRef = number | undefined;
