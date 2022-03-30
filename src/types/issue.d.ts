import { BugRef } from './commit';

import { Milestone, Project } from '@octokit/webhooks-types';

export type Title = {
  name: string;
  bugRef?: BugRef;
};

export type IssueObject = {
  id: number;
  title: string;
  body: string | null;
  assignees?: string[];
  labels?: string[];
  milestone?: Milestone | null;
  project?: Project;
};
