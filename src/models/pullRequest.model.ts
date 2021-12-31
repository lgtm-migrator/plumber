import { IssueObject } from '../types/issue';
import { Issue } from './issue.model';
// import { Commit } from './commit.model';

export class PullRequest extends Issue {
  // private bugRef: number[];

  constructor(
    data: IssueObject // private commits: Commit[]
  ) {
    super(data);
    // should call regex and set bugRef and title
  }

  // set title(newTitle: string) {
  //   this._title._name = newTitle;
  // }

  // get title() {
  //   return `(#${this._title._bugRef}) ${this._title._name}`;
  // }
}
