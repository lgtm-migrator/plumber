import { Bugzilla } from './bugzilla.model';

import { BugObject } from '../types/bug';

export class Bug extends Bugzilla {
  private readonly _id: number;
  // private _state: string | void;
  // private _acks: string | void;

  constructor(data: BugObject) {
    super();

    this._id = data.id;
    // this._state = data?.state ?? this.getState(this.id);
    // this._acks = data?.acks ?? this.getFlags();
  }

  get id() {
    return this._id;
  }

  // get state() {
  //   return this._state;
  // }

  // get acks() {
  //   return this._acks;
  // }

  createComment(content: string) {
    return this.bugzillaAPI.createComment(this._id, content);
  }

  // isBug(bugRef: number) {
  //   this.bugzillaAPI.getBugs([123456]).exclude(['cc_detail']);
  // }

  // getState(bugRef: number) {}

  // setState(bugRef: number, state: string) {}

  // getITM() {}

  // getFlag() {}

  // getFlags() {}
}
