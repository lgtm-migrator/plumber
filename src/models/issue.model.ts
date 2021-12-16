type Title = {
  _name: string;
  _bugRef?: number;
};

export class Issue {
  constructor(
    protected readonly id: number,
    protected title: Title,
    protected body: string,
    protected assignee?: string[],
    protected milestone?: string,
    protected project?: string[]
  ) {}

  getTitle() {
    return this.title;
  }

  setTitle(this: Issue, newTitle: Title) {
    this.title = newTitle;
  }
}
