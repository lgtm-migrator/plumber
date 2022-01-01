import { Issue } from './issue.model';
import { Commit } from './commit.model';

// import { BugRef } from '../types/commit';
import { PullRequestObject } from '../types/pullRequest';
export class PullRequest extends Issue {
  protected _commits: Commit[];

  constructor(data: PullRequestObject) {
    super(data);
    this._commits = data.commits;
  }

  // private getBugRef(): BugRef {
  //   const bugRefs = this.getBugRefs();
  // }

  // private getBugRefs(): BugRef[] {
  //   const bugRefs = this._commits.map(commit => {
  //     return commit.bugRef;
  //   });

  //   return bugRefs;
  // }
}
