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
    this._title = data.title;
    this._body = data.body;
    this._assignee = data?.assignee;
    this._milestone = data?.milestone;
    this._project = data?.project;
  }

  get title() {
    return this._title;
  }

  get titleString() {
    const titleBug = this.isBugRefTitle();

    if (!titleBug) {
      if (this.bugRef) {
        return `(#${this.bugRef}) ${this.title.name}`;
      }

      return this.title.name;
    } else {
      if (this.bugRef) {
        if (this.bugRef !== titleBug) {
          // clear 
          return '';
        }

        return this.title.name;
      }
      
      // clear
      return '';
    }
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

  protected isBugRefTitle() {
    const bugRegex = /^\(#(\d+)\) ?/;

    const bugRef = this.titleString.match(bugRegex);
    return Array.isArray(bugRef) ? +bugRef[1] : false;
  }
}
