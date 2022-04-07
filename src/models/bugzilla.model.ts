import BugzillaAPI, { Bug, Flag } from 'bugzilla';

import Env from '../config/env.config';

import { Flags, FlagValue, BugzillaStatus } from '../types/bug';
import { Trackers } from '../types/trackers';

export class Bugzilla implements Trackers {
  private readonly _api: BugzillaAPI;
  readonly url = 'https://bugzilla.redhat.com/';

  private status?: string;
  private flags?: Flags;
  private component?: string;
  private itr?: string;

  constructor(readonly id: number) {
    const redHatBugzilla = 'https://bugzilla.redhat.com/';
    const APIKey = Env.bugzillaAPIKey;

    console.assert(APIKey, `Bugzilla API Key is missing!`);

    this._api = APIKey
      ? new BugzillaAPI(redHatBugzilla, APIKey)
      : new BugzillaAPI(redHatBugzilla);

    this.url += `show_bug.cgi?id=${id}`;
  }

  private get bugzillaAPI() {
    return this._api;
  }

  async fetch() {
    this.processData(await this.fetchData(['status', 'flags']));
  }

  private processData(data: Omit<Pick<Bug, keyof Bug>, never>) {
    this.status = data.status;
    this.flags = this.processFlags(data.flags);
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

  async isBugValid() {
    /* Check if referenced bug is assigned to correct component and correct product/version */
    /* Check ITM */

    return Promise.resolve(true);
  }

  private verifyComponentAndTarget() {
    return;
  }

  private verifyRequiredFlags() {
    for (let [key, value] of Object.entries(this.flags as object)) {
      if (value != '+') {
        throw new Error(
          `Flag '${key}' has wrong value: '${value}' (bug #${this.id}).`
        );
      }
    }
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
