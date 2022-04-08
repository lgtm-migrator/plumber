import BugzillaAPI, { Bug, Flag } from 'bugzilla';

import Env from '../config/env.config';

import {
  Flags,
  FlagValue,
  BugzillaStatus,
  Verified,
  BugzillaObjects,
} from '../types/bugzilla';
import { Tracker } from '../types/tracker';

export class Bugzilla implements Tracker {
  private readonly _api: BugzillaAPI;
  readonly url = 'https://bugzilla.redhat.com/';

  private _status?: BugzillaStatus;
  private _flags?: Flags;
  private component?: string;
  private itr?: string;

  private _verified?: Verified;

  constructor(readonly id: number, readonly tracker: 'Bugzilla' = 'Bugzilla') {
    const redHatBugzilla = 'https://bugzilla.redhat.com/';
    const APIKey = Env.bugzillaAPIKey;

    console.assert(APIKey, `Bugzilla API Key is missing!`);

    this._api = APIKey
      ? new BugzillaAPI(redHatBugzilla, APIKey)
      : new BugzillaAPI(redHatBugzilla);

    this.url += `show_bug.cgi?id=${id}`;
  }

  get flags() {
    return this._flags;
  }

  private set flags(flags: Flags | undefined) {
    this._flags = flags;
  }

  get status() {
    return this._status;
  }

  private set status(status: BugzillaStatus | undefined) {
    this._status = status;
  }

  private get bugzillaAPI() {
    return this._api;
  }

  private get verified() {
    if (this._verified) {
      return this._verified;
    }

    return (this._verified = this.verify());
  }

  private verify(): Verified {
    return {
      ...this.verifyRequiredFlags(),
      ...this.verifyITR(),
      ...this.verifyComponent(),
    };
  }

  async fetch() {
    this.processData(
      await this.fetchData(['status', 'flags', 'component', 'itr' as keyof Bug])
    );
  }

  private processData(data: Omit<Pick<Bug, keyof Bug>, never>) {
    this.status = data.status as BugzillaStatus;
    this.flags = this.processFlags(data.flags);
    this.itr = (
      data as Omit<Pick<Bug, keyof Bug>, never> & { itr: string }
    ).itr;
    this.component = Array.isArray(data.component)
      ? data.component[0]
      : undefined;
  }

  private async fetchData(data: (keyof Bug)[]) {
    return (await this.bugzillaAPI.getBugs([this.id]).include(data))[0];
  }

  private processFlags(flags?: Flag[]) {
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

  hasBugValid(field: keyof BugzillaObjects) {
    if (
      this.verified.invalid[field] ||
      Array.isArray(this.verified.invalid[field])
        ? this.verified.invalid[field]?.length! > 0
        : false
    ) {
      throw new Error(
        `${this.tracker} #${this.id} has invalid field: ${field}.`
      );
    }

    return;
  }

  isBugValid() {
    if (
      this.verified.invalid === {} ||
      this.verified.invalid === { flags: [] }
    ) {
      return true;
    }

    return false;
  }

  private verifyRequiredFlags() {
    let result: Verified = { valid: { flags: [] }, invalid: { flags: [] } };

    for (let [key, value] of Object.entries(this.flags as object)) {
      if (value != '+') {
        result.invalid.flags?.push(key);
        continue;
      }

      result.valid.flags?.push(key);
    }

    return result;
  }

  private verifyITR() {
    let result: Verified = { valid: {}, invalid: {} };

    // TODO: Make it generic!
    if (this.itr === '9.1.0') {
      return { ...result, valid: { itr: this.itr } };
    }

    return { ...result, invalid: { itr: this.itr } };
  }

  private verifyComponent() {
    let result: Verified = { valid: {}, invalid: {} };

    // TODO: Make it generic!
    if (this.component === 'systemd') {
      return { ...result, valid: { component: this.component } };
    }

    return { ...result, invalid: { component: this.component } };
  }

  async createComment(content: string, isPrivate: boolean = true) {
    if (
      await this.bugzillaAPI.createComment(this.id, content, {
        is_private: isPrivate,
      })
    ) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  async changeStatus(newStatus: BugzillaStatus) {
    if (
      await this.bugzillaAPI.updateBug(this.id, {
        id_or_alias: this.id,
        ids: [this.id],
        status: newStatus,
      })
    ) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  async setFlag(name: string, status: FlagValue) {
    if (
      await this.bugzillaAPI.updateBug(this.id, {
        id_or_alias: this.id,
        ids: [this.id],
        flags: [{ status, name }],
      })
    ) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }
}
