export class Commit {
  constructor(
    private hash: string,
    private title: string,
    private body: string,
    private bugRef: number
  ) {}
}
