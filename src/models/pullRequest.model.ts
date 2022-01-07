import { Issue } from './issue.model';
import { Commit } from './commit.model';

import { PullRequestObject } from '../types/pullRequest';
import { BugRef } from '../types/commit';

export class PullRequest extends Issue {
  protected _commits: Commit[];
  protected _invalidCommits: Commit[] | undefined;

  constructor(data: PullRequestObject) {
    super(data);
    this._commits = data.commits;
  }

  get invalidCommits() {
    if (this._invalidCommits === undefined) {
      this.getCommitsBugRefs();
    }

    return this._invalidCommits;
  }

  set invalidCommits(commits: Commit[] | undefined) {
    this._invalidCommits = commits;
  }

  commitsHaveBugRefs(): boolean {
    for (let i = 0; i < this._commits.length; i++) {
      if (!this._commits[i].bugRef) {
        return false;
      }
    }

    return true;
  }

  getCommitsBugRefs() {
    let bug: BugRef = undefined;

    let invalidCommits = this._commits.filter(commit => {
      if (commit.bugRef && bug && commit.bugRef === bug) {
        return false; // Already noted bug reference
      } else if (commit.bugRef && !bug) {
        bug = commit.bugRef;
        return false; // First bug reference
      } else {
        return true; // Multiple bug references in one PR or no bug reference
      }
    });

    this.bugRef = bug;
    this.invalidCommits = invalidCommits;
  }

  invalidBugReferenceTemplate(commits: Commit[]) {
    // Do not change following indentation
    const template = `⚠️ *Following commits are missing proper bugzilla reference!* ⚠️
---
  
${commits
  .map(commit => {
    let slicedMsg = commit.message.split(/\n/, 1)[0].slice(0, 70);
    const dotDot = '...';

    return slicedMsg.length < 70
      ? `\`\`${slicedMsg}\`\` - ${commit.sha}`
      : `\`\`${slicedMsg}${dotDot}\`\` - ${commit.sha}`;
  })
  .join('\r\n')}
  
---
Please ensure, that all commit messages includes i.e.: _Resolves: #123456789_ or _Related: #123456789_ and only **one** 🐞 is referenced per PR.`;

    return template;
  }
}
