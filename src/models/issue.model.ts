import { Context } from 'probot';
import { Milestone, Project } from '@octokit/webhooks-types';

import { plumberPullEvent } from '../services/common.service';

import { IssueObject, Labels } from '../types/issue';

export class Issue {
  protected readonly id: number;
  protected _title: string;
  protected _body: string | null;
  protected _assignees?: string[];
  protected _labels?: string[];
  protected _milestone?: Milestone | null;
  protected _project?: Project;

  constructor(data: IssueObject) {
    this.id = data.id;
    this._title = data.title;
    this._body = data.body;
    this._assignees = data?.assignees;
    this._labels = data?.labels;
    this._milestone = data?.milestone;
    this._project = data?.project;
  }

  get title() {
    return this._title;
  }

  set title(newTitle: string) {
    this._title = newTitle;
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

  get labels() {
    // TODO: Remove `!`
    return this._labels!;
  }

  set labels(labels: string[]) {
    this._labels = labels;
  }

  setLabel(
    label: Labels,
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

  removeLabel(
    label: Labels,
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
