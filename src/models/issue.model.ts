export type Title = {
  name: string;
  bugRef?: number;
};

export type IssueObject = {
  id: number;
  title: Title;
  body: string;
  assignee?: string[];
  milestone?: string;
  project?: string[];
};

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
    return `(#${this.title.bugRef}) ${this.title.name}`;
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
