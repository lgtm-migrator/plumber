import { Bugzilla } from './bugzilla.model';

import { Acks, BugObject, FlagValue } from '../types/bug';

export class Bug extends Bugzilla {
  private readonly _id?: number;
  private _status?: string;
  private _acks?: Acks;

  constructor(data: BugObject) {
    super();

    this._id = data.id;
    this._status = data?.status;
    this._acks = data?.acks;
    this._acks;
  }

  get id() {
    if (this._id === undefined) {
      throw new Error(`Invalid bug reference: "${this._id}"`);
    }

    return this._id;
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
  }

  get acks() {
    return this._acks;
  }

  set acks(acks) {
    this._acks = acks;
  }

  createComment(content: string) {
    return this.bugzillaAPI.createComment(this.id, content, {
      is_private: true,
    });
  }

  /* Check if referenced bug is assigned to correct component and correct product/version */
  /* Check ITM */

  async fetchStatus() {
    return (await this.bugzillaAPI.getBugs([this.id]).include(['status']))[0]
      .status;
  }

  async fetchAcks(): Promise<Acks | undefined> {
    const flags = (
      await this.bugzillaAPI.getBugs([this.id]).include(['flags'])
    )[0].flags;

    if (!Array.isArray(flags)) {
      return;
    }

    return {
      develAck: flags[flags.findIndex(flag => flag.name === 'devel_ack')]
        .status as FlagValue,
      qaAck: flags[flags.findIndex(flag => flag.name === 'qa_ack')]
        .status as FlagValue,
      release: flags[flags.findIndex(flag => flag.name === 'release')]
        .status as FlagValue,
    };
  }

  async initialize() {
    this.acks = await this.fetchAcks();
    this.status = await this.fetchStatus();
  }
}
