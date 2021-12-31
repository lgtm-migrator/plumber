export type Title = {
  name: string;
  bugRef?: number;
};

export type IssueObject = {
  id: number;
  title: Title;
  body: string;
  assignee?: string[];
  milestone?: string;
  project?: string[];
};
