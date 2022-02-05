import { Title, IssueObject } from '../types/issue';
import { BugRef } from '../types/commit';
import { Milestone, Project } from '@octokit/webhooks-types';

export class Issue {
  protected readonly id: number;
  protected _title: Title;
  protected _body: string | null;
  protected _assignee?: string;
  protected _milestone?: Milestone | null;
  protected _project?: Project;

  constructor(data: IssueObject) {
    this.id = data.id;
    this._title = this.decomposeTitle(data.title.name);
    this._body = data.body;
    this._assignee = data?.assignee;
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
}
