import { Issue } from './issue.model';
import { Commit } from './commit.model';

export class PullRequest extends Issue {
  constructor(
    id: number,
    title: {
      _name: string;
      _bugRef?: number;
    },
    body: string,
    private commits: Commit[]
  ) {
    super(id, title, body);
    // should call regex and set bugRef and title
  }

  set title(newTitle: string) {
    this._title._name = newTitle;
  }

  get title() {
    return `(#${this._title._bugRef}) ${this._title._name}`;
  }
}
