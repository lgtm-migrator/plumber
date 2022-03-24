import { Context } from 'probot';
import { Milestone, Project } from '@octokit/webhooks-types';

import { plumberPullEvent } from '../services/common.service';

import { Title, IssueObject } from '../types/issue';
import { BugRef } from '../types/commit';

export class Issue {
  protected readonly id: number;
  protected _title: Title;
  protected _body: string | null;
  protected _assignees?: string[];
  protected _labels?: string[];
  protected _milestone?: Milestone | null;
  protected _project?: Project;

  constructor(data: IssueObject) {
    this.id = data.id;
    this._title = this.decomposeTitle(data.title.name);
    this._body = data.body;
    this._assignees = data?.assignees;
    this._labels = data?.labels;
    this._milestone = data?.milestone;
    this._project = data?.project;
  }

  get title() {
    return this._title;
  }

  get titleString() {
    if (this.bugRef) {
      return `(#${this.bugRef}) ${this.title.name}`;
    }

    return `${this.title.name}`;
  }

  get labels() {
    // TODO: Remove `!`
    return this._labels!;
  }

  set labels(labels: string[]) {
    this._labels = labels;
  }

  set label(label: string) {
    if (Array.isArray(this.labels) && this.labels?.includes(label)) {
      return;
    }

    if (!Array.isArray(this.labels)) {
      this.labels = [];
    }

    this.labels?.push(label);
  }

  removeLabel(
    label: string,
    context:
      | Context<typeof plumberPullEvent.edited[number]>
      | Context<typeof plumberPullEvent.init[number]>
  ) {
    if (!this.labels.includes(label)) {
      return;
    }

    this.labels = this.labels.filter(item => item != label);
    this.setLabels(context);
  }

  setLabel(
    label: string,
    context:
      | Context<typeof plumberPullEvent.edited[number]>
      | Context<typeof plumberPullEvent.init[number]>
  ) {
    if (this.labels.includes(label)) {
      return;
    }

    this.labels.push(label);
    this.setLabels(context);
  }

  get bugRef() {
    return this.title.bugRef;
  }

  set title(newTitle: Title) {
    this._title = newTitle;
  }

  set bugRef(bug: BugRef) {
    this._title.bugRef = bug;
  }

  /**
   * Decompose title to get raw bug reference and title
   *
   * @param title
   * @returns - Object containing bug reference and title name
   */
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

  /**
   * Set new label on issue
   * @param context
   */
  protected setLabels(
    context:
      | Context<typeof plumberPullEvent.edited[number]>
      | Context<typeof plumberPullEvent.init[number]>
  ) {
    context.octokit.issues.setLabels(
      context.issue({
        labels: this.labels,
      })
    );
  }
}
