import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Commit } from './commits/commit/commit.model';
import { Config } from '../config/config.model';
import { BugRef } from './commits/commit/commit';

import { Milestone, Project } from '@octokit/webhooks-types';
import { Reviews } from './reviews/reviews.model';

export type Title = {
  title: string;
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
  commits: Commits;
  reviews: ListReviews;
}
