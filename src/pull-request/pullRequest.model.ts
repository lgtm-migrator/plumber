import { Context } from 'probot';
import { Milestone, Project } from '@octokit/webhooks-types';
import {
  Allow,
  IsNumber,
  IsString,
  ValidateNested,
  validate,
  IsDefined,
  ValidationError,
} from 'class-validator';

import { ImplementsStatic, plumberPullEvent } from '../services/common.service';

import { Commits } from './commits/commits.model';
import { Commit } from './commits/commit/commit.model';
import { Feedback } from '../feedback/feedback.model';
import { Bugzilla } from '../tracker/bugzilla/bugzilla.model';
import { Jira } from '../tracker/jira/jira.model';
import { Config } from '../config/config.model';
import { Tracker } from '../tracker/tracker.model';

import { PullRequestObject } from './pullRequest';
import { Validation } from '../feedback/feedback';
import { resolve } from 'path';
import { Type } from 'class-transformer';

@ImplementsStatic<Validation<PullRequest<never>>>()
export class PullRequest<
  T extends {
    [K in keyof typeof plumberPullEvent]: Context<
      typeof plumberPullEvent[K][number]
    >;
  }[keyof typeof plumberPullEvent]
> {
  @Allow()
  private readonly _context: T;
  @Allow()
  private readonly _config: Config;

  @IsNumber()
  private readonly id: number;

  @IsString()
  private _title: string;

  @IsString()
  private _body: string | null;
  @Allow()
  private _assignees?: string[];
  // TODO
  @ValidateNested({ each: true, groups: ['labels'] })
  private _labels?: string[];
  @Allow()
  private _milestone?: Milestone | null;
  @Allow()
  private _project?: Project;

  @ValidateNested({
    groups: [
      'commits',
      'commits.invalidBugRef',
      'commits.noBugRef',
      'commits.invalidSourceRef',
    ],
  })
  private _commits!: Commits;
  // private _reviews: Review[];

  @Allow()
  private _feedback: Feedback;

  @IsDefined()
  @ValidateNested({ groups: ['issue-reference'] })
  private _tracker: Tracker | undefined;

  @Allow()
  private readonly availableTrackers = [Bugzilla, Jira!];

  constructor(context: T, config: Config, data: PullRequestObject) {
    this.id = data.id;
    this._context = context;
    this._config = config;

    const decomposedTitle = this.decomposeTitle(data.title);
    this._title = decomposedTitle.title;
    this.setTracker(decomposedTitle.bugRef);

    this._body = data.body;
    this._assignees = data?.assignees;
    this._labels = data?.labels;
    this._milestone = data?.milestone;
    this._project = data?.project;

    this.commits = data.commits;
    this.setTracker(this.commits.bugRef);

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

  get tracker() {
    return this._tracker;
  }

  setTracker(bugRef: string | undefined) {
    if (!!bugRef) {
      return;
    }

    if (this.tracker?.id === bugRef) {
      return;
    }

    this._tracker = new Tracker(bugRef);
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

  set commits(data: Commits) {
    this._commits = data;
  }

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

  // TODO Make it so it uses regex from Trackers (bugzilla and Jira)
  protected decomposeTitle(title: string): { bugRef?: string; title: string } {
    /* Look for bug references in PR title.
     * regex: ^(\(#?(\S*)\))?( *(.*))
     * ^(\(#?(\S*)\))? - Look for string beginning with '(#' or '(' following with any printable characters and ending with ')' - string is stored in group - optional matching (?)
     * ( *(.*)) - Next group is looking for optional spaces and then for any characters - content of title
     * example: (#BUG-REFERENCE-123456) This is example title
     *            ^^^^^^^^^^^^^^^^^^^^  ~~~~~~~~~~~~~~~~~~~~~
     *            bug                   title */
    const titleRegex = /^(\(#?(\S*)\))?( *(.*))/;

    const titleResult = title.match(titleRegex);
    return Array.isArray(titleResult)
      ? { bugRef: titleResult[2], title: titleResult[4] }
      : { bugRef: undefined, title };
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

  static async validate(instance: PullRequest<any>) {
    let feedback = new Feedback();
    let promises: Promise<ValidationError[]>[] = [];

    const commitsNoBugRef = validate(instance, {
      groups: ['commits.noBugRef'],
    });

    const commitsInvalidBugRef = validate(instance, {
      groups: ['commits.invalidBugRef'],
    });

    const commitsInvalidSourceRef = validate(instance, {
      groups: ['commits.invalidSourceRef'],
    });

    const results = await Promise.all([
      commitsNoBugRef,
      commitsInvalidBugRef,
      commitsInvalidSourceRef /* CI */ /* review */,
      ,
    ]);

    let shouldFail = false;

    if (results[1].length > 0) {
      feedback.message.setCommitsTemplate(instance.commits.invalidBugRef);
      shouldFail = true;
    }

    if (results[2].length > 0) {
      feedback.message.setUpstreamTemplate(instance.commits.invalidSourceRef);
      shouldFail = true;
    }

    if (shouldFail) return feedback;

    // validate(instance, {
    //   ...validationOptions,
    //   groups: ['upstream'],
    // }).then(_ => {
    //   // TODO: set wrong upstream section
    //   // feedback.message.
    // });

    // validate(instance, {
    //   ...validationOptions,
    //   groups: ['commits'],
    // }).then(_ => {
    //   // feedback.message.
    // });

    // TODO: CI

    // TODO: REVIEW

    // TODO: LABELS

    return feedback;
  }

  static async getCommits(
    context:
      | Context<typeof plumberPullEvent.edited[number]>
      | Context<typeof plumberPullEvent.init[number]>
  ) {
    return new Commits(
      (await context.octokit.pulls.listCommits(context.pullRequest())).data.map(
        commit => {
          const data = {
            sha: commit.sha,
            message: commit.commit.message,
          };

          return new Commit(data);
        }
      )
    );
  }

  static composeInput(
    context:
      | Context<typeof plumberPullEvent.edited[number]>
      | Context<typeof plumberPullEvent.init[number]>,
    commits: Commits
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
