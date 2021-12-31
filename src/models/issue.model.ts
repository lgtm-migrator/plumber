import { Title, IssueObject } from '../types/issue';

export class Issue {
  protected readonly id: number;
  protected _title: Title;
  protected _body: string;
  protected _assignee?: string[];
  protected _milestone?: string;
  protected _project?: string[];

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
    if (this.title.bugRef) {
      return `(#${this.title.bugRef}) ${this.title.name}`;
    }

    return this.title.name;   
  }

  get bugRef() {
    return this.title.bugRef;
  }

  set title(newTitle: Title) {
    this._title = newTitle;
  }

  set bugRef(bug: number | undefined) {
    this._title.bugRef = bug;
  }
}
