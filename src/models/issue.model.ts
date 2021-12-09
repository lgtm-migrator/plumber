type Title = {
  _name: string;
  _bugRef?: number;
};

export class Issue {
  constructor(
    protected readonly id: number,
    protected _title: Title,
    protected _body: string
  ) {}
}
