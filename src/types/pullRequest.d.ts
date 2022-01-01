import { Commit } from '../models/commit.model';

import { IssueObject } from './issue';

export interface PullRequestObject extends IssueObject {
  commits: Commit[];
}
