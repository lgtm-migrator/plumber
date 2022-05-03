import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Commit } from '../models/commit.model';
import { Config } from '../models/config/config.model';
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

export interface PullRequestObject extends IssueObject {
  commits: Commit[];
}
