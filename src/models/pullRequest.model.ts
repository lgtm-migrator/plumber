import { IssueObject } from '../types/issue';
import { Issue } from './issue.model';
import { Commit } from './commit.model';

export class PullRequest extends Issue {
  protected _commits: Commit[];

  constructor(data: IssueObject, commits: Commit[]) {
    super(data);
    this._commits = commits;
  }
}
