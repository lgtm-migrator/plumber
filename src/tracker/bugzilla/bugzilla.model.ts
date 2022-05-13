import BugzillaAPI, { Bug, Flag } from 'bugzilla';
import { IsNumber } from 'class-validator';

import Env from '../../config/env/env.config';

import { FlagValue, Validated, BugzillaObjects } from './bugzilla';
import { TrackerInterface, Status, Flags } from '../tracker';

export class Bugzilla implements TrackerInterface {
  readonly tracker = 'Bugzilla';
  readonly bugIdRegex = /#(\d+)/;

  private readonly _api: BugzillaAPI;
  readonly url = 'https://bugzilla.redhat.com/';

  @IsNumber()
  readonly id: number;
  status?: Status;
  flags?: Flags;
  private component?: string;
  private itr?: string;

  private _validated?: Validated;

  constructor(id: number) {
    const redHatBugzilla = 'https://bugzilla.redhat.com/';
    const APIKey = Env.bugzillaAPIKey;

    this.id = id;

    this._api = APIKey
      ? new BugzillaAPI(redHatBugzilla, APIKey)
      : new BugzillaAPI(redHatBugzilla);

    this.url += `show_bug.cgi?id=${id}`;
  }

  private get bugzillaAPI() {
    return this._api;
  }

  /* --- Initialize --- */

  async initialize() {
    this.processData(
      await this.fetchData(['status', 'flags', 'component', 'itr' as keyof Bug])
    );
  }

  private processData(data: Omit<Pick<Bug, keyof Bug>, never>) {
    this.status = data.status as Status;
    this.flags = this.processFlags(data.flags);
    this.itr = (
      data as Omit<Pick<Bug, keyof Bug>, never> & { itr: string }
    ).itr;
    this.component = Array.isArray(data.component)
      ? data.component[0]
      : undefined;
  }

  private processFlags(flags?: Flag[]) {
    if (!Array.isArray(flags)) {
      return;
    }

    return {
      develAck: {
        ...this.processFlag(
          flags[flags.findIndex(flag => flag.name === 'devel_ack')]
        ),
      },
      qaAck: {
        ...this.processFlag(
          flags[flags.findIndex(flag => flag.name === 'qa_ack')]
        ),
      },
      release: {
        ...this.processFlag(
          flags[flags.findIndex(flag => flag.name === 'release')]
        ),
      },
    };
  }

  private processFlag(flag: Flag) {
    return {
      name: flag.name,
      status: flag.status,
      approved: flag.status === '+' ? true : false,
    };
  }

  private async fetchData(data: (keyof Bug)[]) {
    return (await this.bugzillaAPI.getBugs([this.id]).include(data))[0];
  }

  /* --- Validate --- */

  hasBugValid(field: keyof BugzillaObjects) {
    if (!this.isFieldValid(field)) {
      throw new Error(
        `${this.tracker} #${this.id} has invalid field: ${field}.`
      );
    }

    return;
  }

  private isFieldValid(field: keyof BugzillaObjects) {
    return this.validatedData.invalid[field] &&
      Array.isArray(this.validatedData.invalid[field])
      ? this.validatedData.invalid[field]?.length! > 0
      : false;
  }

  private get validatedData() {
    if (this._validated) {
      return this._validated;
    }

    return (this._validated = this.validate());
  }

  private validate(): Validated {
    return {
      ...this.verifyRequiredFlags(),
      ...this.verifyITR(),
      ...this.verifyComponent(),
    };
  }

  private verifyRequiredFlags() {
    let result: Validated = { valid: { flags: [] }, invalid: { flags: [] } };

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
    let result: Validated = { valid: {}, invalid: {} };

    // TODO: Make it generic!
    if (this.itr === '9.1.0') {
      return { ...result, valid: { itr: this.itr } };
    }

    return { ...result, invalid: { itr: this.itr } };
  }

  private verifyComponent() {
    let result: Validated = { valid: {}, invalid: {} };

    // TODO: Make it generic!
    if (this.component === 'systemd') {
      return { ...result, valid: { component: this.component } };
    }

    return { ...result, invalid: { component: this.component } };
  }

  /* --- --- */

  isBugValid() {
    if (
      this.validatedData.invalid === {} ||
      this.validatedData.invalid === { flags: [] }
    ) {
      return true;
    }

    return false;
  }

  /* --- --- */

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

  async changeStatus(newStatus: Status) {
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
