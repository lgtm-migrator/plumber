import { Issue } from './issue.model';
import { Commit } from './commit.model';

export class PullRequest extends Issue {
  constructor(
    id: number,
    title: string,
    body: string,
    private commits: Commit[]
  ) {
    super(id, title, body);
  }
}
