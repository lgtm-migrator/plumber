import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Commit } from './commit.model';
import { Issue } from './issue.model';
import { Feedback } from './feedback.model';
import { Bugzilla } from './bugzilla.model';

import { BugRef, CommitObject } from '../types/commit';
import { PullRequestObject } from '../types/pullRequest';
import { Tracker } from '../types/tracker';

export class PullRequest extends Issue {
  private readonly _context:
    | Context<typeof plumberPullEvent.edited[number]>
    | Context<typeof plumberPullEvent.init[number]>;
  protected _commits: Commit[];
  // protected _reviews: Review[];
  protected _feedback: Feedback;

  protected _invalidCommits: Commit[];
  protected _commitsWithoutSource: Commit[];

  protected _bugRef?: number;
  protected _tracker?: Tracker;

  constructor(data: PullRequestObject) {
    super(data);
    this._context = data.context;
    this._commits = data.commits;
    this._feedback = new Feedback({ context: this.context, message: {} });

    const decomposedTitle = this.decomposeTitle(data.title);
    this._title = decomposedTitle.name;
    this._bugRef = decomposedTitle?.bugRef;

    this._invalidCommits = this.getCommitsBugRefs();
    this._commitsWithoutSource = this.getCommitsWithoutSource();
  }

  get titleString() {
    if (this.bugRef) {
      return `(#${this.bugRef}) ${this.title}`;
    }

    return `${this.title}`;
  }

  get bugRef() {
    return this._bugRef;
  }

  set bugRef(bug) {
    this._bugRef = bug;
  }

  private get context() {
    return this._context;
  }

  get feedback() {
    return this._feedback;
  }

  get commits() {
    return this._commits;
  }

  get invalidCommits() {
    return this._invalidCommits;
  }

  get commitsWithoutSource() {
    return this._commitsWithoutSource;
  }

  set invalidCommits(commits: Commit[]) {
    this._invalidCommits = commits;
  }

  // get id() {
  //   if (this._id === undefined) {
  //     throw new Error(`Invalid bug reference: "${this._id}"`);
  //   }

  //   return this._id;
  // }

  async getBug() {
    if (!this._tracker) {
      await this.setBug();
    }

    return this._tracker;
  }

  async setBug() {
    if (!this.bugRef) {
      throw new Error(
        `Failed to create Bug object with bug id: '${this.bugRef}'`
      );
    }

    this._tracker = new Bugzilla(this.bugRef);
    await this._tracker.fetch();
  }

  doesCommitsHave(property: keyof CommitObject): boolean {
    for (let i = 0; i < this.commits.length; i++) {
      if (!this.commits[i][property]) {
        return false;
      }
    }

    return true;
  }

  protected getCommitsBugRefs() {
    let bug: BugRef = undefined;

    let invalidCommits = this.commits.filter(commit => {
      if (commit.bugRef && bug && commit.bugRef === bug) {
        /* Already noted bug reference */
        return false;
      } else if (commit.bugRef && !bug) {
        /* First bug reference */
        bug = commit.bugRef;
        return false;
      } else {
        /* Multiple bug references in one PR or no bug reference */
        return true;
      }
    });

    if (invalidCommits.length) {
      bug = undefined;
    }

    this.bugRef = bug;
    return invalidCommits;
  }

  protected getCommitsWithoutSource() {
    return this.commits.filter(commit => {
      if (commit.upstreamRef || commit.rhelOnly) {
        return false;
      }

      /* Unknown commit source */
      return true;
    });
  }

  setTitle(oldTitle: string) {
    if (oldTitle === this.titleString) {
      return;
    }

    this.context.octokit.pulls.update(
      this.context.pullRequest({
        title: this.titleString,
      })
    );
  }

  protected decomposeTitle(title: string) {
    /* Look for bug references in PR title.
     * regex: ^(\(#(\d+)\))?( ?(.*))
     * ^(\(#(\d+)\))? - Look for string beginning with '(#' following with numbers and ending with ')' - the number, bug reference is stored in group - optional matching (?)
     * ( ?(.*)) - Next group is looking for optional space and then for any characters - content of title
     * example: (#123456) This is example title
     *            ^^^^^^  ~~~~~~~~~~~~~~~~~~~~~
     *            bug     title */
    const titleRegex = /^(\(#(\d+)\))?( ?(.*))/;

    const titleResult = title.match(titleRegex);
    return Array.isArray(titleResult)
      ? { bugRef: +titleResult[2], name: titleResult[4] }
      : { name: title };
  }

  async verifyBugRef() {
    try {
      if (this.bugRef == undefined || !this.doesCommitsHave('bugRef')) {
        throw new Error(`PR #${this.id} is missing proper bugzilla reference.`);
      }

      const tracker = await this.getBug();
      tracker!.hasBugValid('component');
      tracker!.hasBugValid('itr');

      this.removeLabel('needs-bz', this.context);
      this.feedback.clearCommentSection('commits');

      return true;
    } catch (err) {
      this.context.log.debug((err as Error).message);
      this.setLabel('needs-bz', this.context);
      this.feedback.setCommitsTemplate(this.invalidCommits);

      return false;
    }
  }

  verifyCommits() {
    try {
      if (
        !this.doesCommitsHave('upstreamRef') ||
        this.doesCommitsHave('rhelOnly')
      ) {
        throw new Error(`PR #${this.id} is missing proper bugzilla reference.`);
      }

      this.removeLabel('needs-upstream', this.context);
      this.feedback.clearCommentSection('upstream');
    } catch (err) {
      this.context.log.debug((err as Error).message);
      this.setLabel('needs-upstream', this.context);
      this.feedback.setUpstreamTemplate(this.commitsWithoutSource);
    }
  }

  async verifyFlags() {
    try {
      (await this.getBug())!.hasBugValid('flags');

      this.removeLabel('needs-acks', this.context);
      this.feedback.clearCommentSection('flags');
    } catch (err) {
      this.context.log.debug((err as Error).message);
      this.setLabel('needs-acks', this.context);

      const tracker = await this.getBug();
      this.feedback.setFlagsTemplate({
        flags: tracker!.flags!,
        bug: tracker!,
      });
    }
  }

  verifyCi() {
    try {
      // if (!this.ciHavePassed()) {
      // }

      this.removeLabel('needs-ci', this.context);
      this.feedback.clearCommentSection('ci');
    } catch (err) {
      this.context.log.debug((err as Error).message);
      this.setLabel('needs-ci', this.context);
      this.feedback.setCITemplate();
    }
  }

  verifyReviews() {
    try {
      // if (!this.prIsApproved()) {
      // }

      this.removeLabel('needs-review', this.context);
      this.feedback.clearCommentSection('reviews');
    } catch (err) {
      this.context.log.debug((err as Error).message);
      this.setLabel('needs-review', this.context);
      this.feedback.setCodeReviewTemplate();
    }
  }

  isLgtm() {
    return false;
  }

  async merge() {
    return;
  }

  static async getCommits(
    context:
      | Context<typeof plumberPullEvent.edited[number]>
      | Context<typeof plumberPullEvent.init[number]>
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
    context:
      | Context<typeof plumberPullEvent.edited[number]>
      | Context<typeof plumberPullEvent.init[number]>,
    commits: Commit[]
  ): PullRequestObject {
    const { pull_request } = context.payload;

    return {
      id: context.payload.number,
      title: pull_request.title,
      body: pull_request.body,
      assignees: pull_request.assignees.map(assignee => assignee.login),
      labels: pull_request.labels.map(label => label.name),
      milestone: pull_request?.milestone,
      // project: pull_request?.project,
      context,
      commits,
    };
  }
}
