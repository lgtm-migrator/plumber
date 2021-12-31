import { CommitObject } from '../types/commit';

export class Commit {
  private _hash: string;
  private _title: string;
  private _body: string;
  private _bugRef: number;

  constructor(data: CommitObject) {
    this._hash = data.hash;
    this._title = data.title;
    this._body = data.body;
    this._bugRef = data.bugRef;
  }

  get hash() {
    return this._hash;
  }

  get title() {
    return this._title;
  }

  get body() {
    return this._body;
  }

  get bugRef() {
    return this._bugRef;
  }
}
