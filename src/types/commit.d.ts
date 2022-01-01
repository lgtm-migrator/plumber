export type CommitObject = {
  sha: string;
  message: string;
  title?: string;
  bugRef?: BugRef;
};

export type BugRef = number | undefined;
