import { Issue } from './issue.model';

export class PullRequest extends Issue {
  constructor(
    protected readonly id: number,
    protected title: string,
    protected body: string
  ) {
    super(id, title, body);
  }
}
