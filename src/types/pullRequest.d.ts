import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Commit } from '../models/commit.model';
import { Config } from '../models/config.model';

import { IssueObject } from './issue';

export interface PullRequestObject extends IssueObject {
  commits: Commit[];
}
