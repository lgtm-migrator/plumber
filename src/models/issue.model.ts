export class Issue {
  protected title: {
    bugRef: number | undefined;
    title: string;
  } = { bugRef: undefined, title: '' };

  constructor(
    protected readonly id: number,
    title: string,
    protected body: string
  ) {
    // should call regex and set bugRef and title
    this.title.title = title;
  }
}
