import metadata from 'probot-metadata';

import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Issue } from './issue.model';
import { Commit } from './commit.model';

import { BugRef } from '../types/commit';
import { PullRequestObject } from '../types/pullRequest';

export class PullRequest extends Issue {
  protected _commits: Commit[];
  protected _invalidCommits: Commit[];

  constructor(data: PullRequestObject) {
    super(data);
    this._commits = data.commits;

    this._invalidCommits = this.getCommitsBugRefs();
  }

  get invalidCommits() {
    return this._invalidCommits;
  }

  set invalidCommits(commits: Commit[]) {
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

  protected getCommitsBugRefs() {
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
    return invalidCommits;
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

  setTitle(
    oldTitle: string,
    context: Context<typeof plumberPullEvent.edited[number]>
  ) {
    if (oldTitle === this.titleString) {
      return;
    }

    context.octokit.pulls.update(
      context.pullRequest({
        title: this.titleString,
      })
    );
  }

  // TODO: Fix this `context as unknown as Context`
  async setReviewComment(
    context: Context<typeof plumberPullEvent.edited[number]>
  ) {
    // try to get review_id metadata if set
    const reviewId: number = await metadata(context as unknown as Context).get(
      'review_id'
    );

    if (!reviewId) {
      // there is no review_id
      const reviewPayload = await this.createReviewComment(
        this.invalidBugReferenceTemplate(this.invalidCommits),
        context
      );

      // store id as metadata to be able to refer to comment and update/delete it if needed
      await metadata(context as unknown as Context).set(
        'review_id',
        reviewPayload.data.id
      );
    }

    this.updateReviewComment(reviewId, '', context);
  }

  protected createReviewComment(
    body: string,
    context: Context<typeof plumberPullEvent.edited[number]>
  ) {
    return context.octokit.pulls.createReview(
      context.pullRequest({
        event: 'COMMENT',
        body,
      })
    );
  }

  protected updateReviewComment(
    review_id: number,
    body: string,
    context: Context<typeof plumberPullEvent.edited[number]>
  ) {
    return context.octokit.rest.pulls.updateReview(
      context.pullRequest({
        review_id,
        body,
      })
    );
  }

  // TODO:
  async clearReviewComment(
    _context: Context<typeof plumberPullEvent.edited[number]>
  ) {}

  static async getCommits(
    context: Context<typeof plumberPullEvent.edited[number]>
  ) {
    return (
      await context.octokit.pulls.listCommits(context.pullRequest())
    ).data.map(commit => {
      const data = {
        sha: commit.sha,
        message: commit.commit.message,
      };

      return new Commit(data);
    });
  }

  static composeInput(
    context: Context<typeof plumberPullEvent.edited[number]>,
    commits: Commit[]
  ): PullRequestObject {
    const { pull_request } = context.payload;

    return {
      id: pull_request.id,
      title: { name: pull_request.title },
      body: pull_request.body,
      assignees: pull_request.assignees.map(assignee => assignee.login),
      labels: pull_request.labels.map(label => label.name),
      milestone: pull_request?.milestone,
      // project: pull_request?.project,
      commits,
    };
  }
}
