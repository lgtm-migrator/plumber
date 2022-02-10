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
    this.labels?.push(label);
  }

  removeLabel(
    label: string,
    context: Context<typeof plumberPullEvent.edited[number]>
  ) {
    if (!this.labels.includes(label)) {
      return;
    }

    this.labels = this.labels.filter(item => item != label);
    this.setLabels(context);
  }

  setLabel(
    label: string,
    context: Context<typeof plumberPullEvent.edited[number]>
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

  protected decomposeTitle(title: string) {
    const titleRegex = /^(\(#(\d+)\))?( ?(.*))/;

    const titleResult = title.match(titleRegex);
    return Array.isArray(titleResult)
      ? { bugRef: +titleResult[2], name: titleResult[4] }
      : { name: title };
  }

  protected setLabels(
    context: Context<typeof plumberPullEvent.edited[number]>
  ) {
    context.octokit.issues.setLabels(
      context.issue({
        labels: this.labels,
      })
    );
  }
}
