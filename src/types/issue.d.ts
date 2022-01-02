import { BugRef } from './commit';

export type Title = {
  name: string;
  bugRef?: BugRef;
};

export type IssueObject = {
  id: number;
  title: Title;
  body: string;
  assignee?: string;
  milestone?: string;
  project?: string;
};
