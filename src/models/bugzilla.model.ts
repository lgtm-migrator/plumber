import BugzillaAPI from 'bugzilla';

import Env from '../config/env.config';

export abstract class Bugzilla {
  private readonly _api: BugzillaAPI;

  constructor() {
    const redHatBugzilla = 'https://bugzilla.redhat.com/';
    const APIKey = Env.bugzillaAPIKey;

    this._api = APIKey
      ? new BugzillaAPI(redHatBugzilla, APIKey)
      : new BugzillaAPI(redHatBugzilla);
  }

  get bugzillaAPI() {
    return this._api;
  }
}
