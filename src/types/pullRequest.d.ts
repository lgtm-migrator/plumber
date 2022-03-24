import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Commit } from '../models/commit.model';

import { IssueObject } from './issue';

export interface PullRequestObject extends IssueObject {
  context:
    | Context<typeof plumberPullEvent.edited[number]>
    | Context<typeof plumberPullEvent.init[number]>;
  commits: Commit[];
}
