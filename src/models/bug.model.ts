import { Bugzilla } from './bugzilla.model';

import { BugObject } from '../types/bug';

export class Bug extends Bugzilla {
  private readonly _id: number;
  private _state: string;
  private _acks: string;

  constructor(data: BugObject) {
    super();

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
