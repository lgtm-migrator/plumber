import { BugzillaObject } from '../types/bugzilla';

export class Bugzilla {
  protected readonly _id: number;
  protected _state: string;
  protected _acks: string;

  constructor(data: BugzillaObject) {
    this._id = data.id;
    this._state = data?.state;
    this._acks = data?.acks;
  }

  get id() {
    return this.id;
  }

  get state() {
    return this._state;
  }

  get acks() {
    return this._acks;
  }
}
