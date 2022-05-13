export type CommitObject = {
  sha: string;
  message: string;
  title?: string;
  bugRef?: BugRef;
  upstreamRef?: string;
  rhelOnly?: boolean;
};

export type BugRef = number | undefined;
