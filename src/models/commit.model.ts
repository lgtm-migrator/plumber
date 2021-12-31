import { CommitObject, BugRef } from '../types/commit';

export class Commit {
  private readonly _hash: String;
  private readonly _message: String;
  private readonly _title: String | undefined;
  private readonly _bugRef: BugRef;

  constructor(data: CommitObject) {
    this._hash = data.hash;
    this._message = data.message;
    this._title = data?.title ?? this.getTitle(this.message);
    this._bugRef = data?.bugRef ?? this.getBugRef(this.message);
  }

  get hash() {
    return this._hash;
  }

  get title() {
    return this._title;
  }

  get message() {
    return this._message;
  }

  get bugRef() {
    return this._bugRef;
  }

  private getTitle(message: String): String {
    const TitleSize = 70;
    let slicedMsg = message.split(/\n/, 1)[0].slice(0, TitleSize);

    return slicedMsg.length < TitleSize ? slicedMsg : `${slicedMsg}...`;
  }

  private getBugRef(message: String): BugRef {
    const bugRegex = /(^\s*|\n|\\n)(Resolves|Related): ?(#\d+)$/;

    const bugRef = message.match(bugRegex);
    return Array.isArray(bugRef) ? +bugRef[3] : undefined;
  }
}
