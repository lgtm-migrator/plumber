import { Allow, ArrayMaxSize, ValidateNested } from 'class-validator';

import { Commit } from './commit/commit.model';

export class Commits {
  @ValidateNested({ each: true })
  commits: Commit[];

  @Allow()
  bugRef: string | undefined;

  @ArrayMaxSize(0, {
    groups: ['commits', 'commits.noBugRef'],
  })
  private _noBugRef: Commit[] = [];

  @ArrayMaxSize(0, {
    groups: ['commits', 'commits.invalidBugRef'],
  })
  private _invalidBugRef: Commit[] = [];

  @ArrayMaxSize(0, {
    groups: ['commits', 'commits.invalidSourceRef'],
  })
  private _invalidSourceRef: Commit[] = [];

  constructor(commits: Commit[]) {
    this.commits = commits;
    this.noBugRef = this.getCommitsMissingBugRefs();

    const { invalidCommits, bugRef } = this.getCommitsBugRef();
    this.invalidBugRef = invalidCommits;
    this.bugRef = bugRef;

    this.invalidSourceRef = this.getCommitsWithoutSource();
  }

  get noBugRef() {
    return this._noBugRef;
  }

  set noBugRef(data: Commit[]) {
    if (Array.isArray(this._noBugRef)) {
      this._noBugRef.push(...data);
      return;
    }

    this._noBugRef = data;
  }

  get invalidBugRef() {
    return this._invalidBugRef;
  }

  set invalidBugRef(data: Commit[]) {
    if (Array.isArray(this._invalidBugRef)) {
      this._invalidBugRef.push(...data);
      return;
    }

    this._invalidBugRef = data;
  }

  get invalidSourceRef() {
    return this._invalidSourceRef;
  }

  set invalidSourceRef(data: Commit[]) {
    if (Array.isArray(this._invalidSourceRef)) {
      this._invalidSourceRef.push(...data);
      return;
    }

    this._invalidSourceRef = data;
  }

  private getCommitsMissingBugRefs() {
    let invalidCommits: Commit[] = [];

    this.commits.forEach(commit => {
      if (commit.hasBugRef()) {
        return;
      }

      invalidCommits.push(commit);
    });

    return invalidCommits;
  }

  private getCommitsBugRef() {
    let result: { invalidCommits: Commit[]; bugRef: string | undefined } = {
      invalidCommits: [],
      bugRef: undefined,
    };

    result.invalidCommits = this.commits.filter(commit => {
      if (commit.bugRef && result.bugRef && commit.bugRef === result.bugRef) {
        /* Already noted bug reference */
        return false;
      } else if (commit.bugRef && !result.bugRef) {
        /* First bug reference */
        result.bugRef = commit.bugRef;
        return false;
      } else {
        /* Multiple bug references in one PR or no bug reference */
        return true;
      }
    });

    if (result.invalidCommits) {
      result.bugRef = undefined;
    }

    return result;
  }

  private getCommitsWithoutSource() {
    let invalidCommits: Commit[] = [];

    this.commits.forEach(commit => {
      if (commit.hasUpstreamRef()) {
        return;
      }

      invalidCommits.push(commit);
    });

    return invalidCommits;
  }
}
