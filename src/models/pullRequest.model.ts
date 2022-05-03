import { Context } from 'probot';
import { Milestone, Project } from '@octokit/webhooks-types';

import { plumberPullEvent } from '../services/common.service';

import { Commit } from './commit.model';
import { Feedback } from './feedback.model';
import { Bugzilla } from './bugzilla.model';
import { Config } from './config/config.model';

import { BugRef /*CommitObject*/ } from '../types/commit';
import { PullRequestObject } from '../types/pullRequest';
import { Tracker } from '../types/tracker';
import { ArrayMaxSize, ValidateNested } from 'class-validator';

export class PullRequest<
  T extends {
    [K in keyof typeof plumberPullEvent]: Context<
      typeof plumberPullEvent[K][number]
    >;
  }[keyof typeof plumberPullEvent]
> {
  private readonly id: number;
  private _title: { bugRef?: BugRef; name: string };
  private _body: string | null;
  private _assignees?: string[];
  private _labels?: string[];
  private _milestone?: Milestone | null;
  private _project?: Project;

  private _commits!: Commit[];
  // private _reviews: Review[];
  private _feedback: Feedback;

  @ArrayMaxSize(0)
  private _invalidCommits!: Commit[];
  @ArrayMaxSize(0)
  private _commitsWithoutSource!: Commit[];

  @ValidateNested()
  private _tracker?: Tracker;

  constructor(
    private readonly _context: T,
    private readonly _config: Config,
    data: PullRequestObject
  ) {
    this.id = data.id;
    this._title = this.decomposeTitle(data.title);
    this._body = data.body;
    this._assignees = data?.assignees;
    this._labels = data?.labels;
    this._milestone = data?.milestone;
    this._project = data?.project;

    this.commits = data.commits;
    this._feedback = new Feedback({ message: {} });
  }

  // get title() {
  //   return this._title;
  // }

  // set title(newTitle: string) {
  //   this._title = newTitle;
  // }

  // set label(label: string) {
  //   if (Array.isArray(this.labels) && this.labels?.includes(label)) {
  //     return;
  //   }

  //   if (!Array.isArray(this.labels)) {
  //     this.labels = [];
  //   }

  //   this.labels?.push(label);
  // }

  // get labels() {
  //   return this._labels!;
  // }

  // set labels(labels: string[]) {
  //   this._labels = labels;
  // }

  // setLabel(label: string) {
  //   if (this.labels.includes(label)) {
  //     return;
  //   }

  //   this.labels.push(label);
  //   this.setLabels();
  // }

  // removeLabel(label: string) {
  //   if (!this.labels.includes(label)) {
  //     return;
  //   }

  //   this.labels = this.labels.filter(item => item != label);
  //   this.setLabels();
  // }

  // protected setLabels() {
  //   this.context.octokit.issues.setLabels(
  //     this.context.issue({
  //       labels: this.labels,
  //     })
  //   );
  // }

  // get titleString() {
  //   if (this.tracker) {
  //     return `(#${this.tracker.id}) ${this.title}`;
  //   }

  //   return `${this.title}`;
  // }

  get tracker() {
    return this._tracker;
  }

  setTracker(bugRef: BugRef) {
    if (!bugRef) {
      return;
    }

    this._tracker = new Bugzilla(bugRef);
  }

  // private get context() {
  //   return this._context;
  // }

  // get feedback() {
  //   return this._feedback;
  // }

  get commits() {
    return this._commits;
  }

  set commits(data: Commit[]) {
    this._commits = data;

    const { invalidCommits, bugRef } = this.getCommitsBugRefs();
    this._commitsWithoutSource = this.getCommitsWithoutSource();

    this._invalidCommits = invalidCommits;
    this.setTracker(bugRef);
  }

  // get invalidCommits() {
  //   return this._invalidCommits;
  // }

  // get commitsWithoutSource() {
  //   return this._commitsWithoutSource;
  // }

  // async getBug() {
  //   if (!this._tracker) {
  //     await this.setBug();
  //   }

  //   return this._tracker;
  // }

  // async setTracker(bugRef: BugRef) {
  //   if (!this.tracker) {
  //     throw new Error(
  //       `Failed to create Tracker object with bug id: '${bugRef}'`
  //     );
  //   }

  //   if (!bugRef) {
  //     return;
  //   }

  //   this._tracker = new Bugzilla(bugRef);
  //   await this._tracker.initialize();
  // }

  // doesCommitsHave(property: keyof CommitObject): boolean {
  //   for (let i = 0; i < this.commits.length; i++) {
  //     if (!this.commits[i][property]) {
  //       return false;
  //     }
  //   }

  //   return true;
  // }

  protected getCommitsBugRefs() {
    let result: { invalidCommits: Commit[]; bugRef: BugRef } = {
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

  protected getCommitsWithoutSource() {
    return this.commits.filter(commit => {
      if (commit.upstreamRef || commit.rhelOnly) {
        return false;
      }

      /* Unknown commit source */
      return true;
    });
  }

  // setTitle(oldTitle: string) {
  //   if (oldTitle === this.titleString) {
  //     return;
  //   }

  //   this.context.octokit.pulls.update(
  //     this.context.pullRequest({
  //       title: this.titleString,
  //     })
  //   );
  // }

  protected decomposeTitle(title: string): { bugRef?: BugRef; name: string } {
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
      : { bugRef: undefined, name: title };
  }

  // async verifyBugRef() {
  //   try {
  //     if (this.bugRef == undefined || !this.doesCommitsHave('bugRef')) {
  //       throw new Error(`PR #${this.id} is missing proper bugzilla reference.`);
  //     }

  //     const tracker = await this.getBug();
  //     tracker!.hasBugValid('component');
  //     tracker!.hasBugValid('itr');

  //     this.removeLabel('needs-bz');
  //     this.feedback.clearCommentSection('commits');

  //     return true;
  //   } catch (err) {
  //     this.context.log.debug((err as Error).message);
  //     this.setLabel('needs-bz');
  //     this.feedback.setCommitsTemplate(this.invalidCommits);

  //     return false;
  //   }
  // }

  // verifyCommits() {
  //   try {
  //     if (
  //       !this.doesCommitsHave('upstreamRef') ||
  //       this.doesCommitsHave('rhelOnly')
  //     ) {
  //       throw new Error(`PR #${this.id} is missing proper bugzilla reference.`);
  //     }

  //     this.removeLabel('needs-upstream');
  //     this.feedback.clearCommentSection('upstream');
  //   } catch (err) {
  //     this.context.log.debug((err as Error).message);
  //     this.setLabel('needs-upstream');
  //     this.feedback.setUpstreamTemplate(this.commitsWithoutSource);
  //   }
  // }

  // async verifyFlags() {
  //   try {
  //     (await this.getBug())!.hasBugValid('flags');

  //     this.removeLabel('needs-acks');
  //     this.feedback.clearCommentSection('flags');
  //   } catch (err) {
  //     this.context.log.debug((err as Error).message);
  //     this.setLabel('needs-acks');

  //     const tracker = await this.getBug();
  //     this.feedback.setFlagsTemplate({
  //       flags: tracker!.flags!,
  //       bug: tracker!,
  //     });
  //   }
  // }

  // verifyCi() {
  //   try {
  //     // if (!this.ciHavePassed()) {
  //     // }

  //     this.removeLabel('needs-ci');
  //     this.feedback.clearCommentSection('ci');
  //   } catch (err) {
  //     this.context.log.debug((err as Error).message);
  //     this.setLabel('needs-ci');
  //     this.feedback.setCITemplate();
  //   }
  // }

  // verifyReviews() {
  //   try {
  //     // if (!this.prIsApproved()) {
  //     // }

  //     this.removeLabel('needs-review');
  //     this.feedback.clearCommentSection('reviews');
  //   } catch (err) {
  //     this.context.log.debug((err as Error).message);
  //     this.setLabel('needs-review');
  //     this.feedback.setCodeReviewTemplate();
  //   }
  // }

  // isLgtm() {
  //   return false;
  // }

  // async merge() {
  //   return;
  // }

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
      commits,
    };
  }
}
