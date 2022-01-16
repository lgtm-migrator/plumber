import BugzillaAPI from 'bugzilla';

export abstract class Bugzilla {
  private readonly _api: BugzillaAPI;

  constructor() {
    const redHatBugzilla = 'https://bugzilla.redhat.com/';

    this._api = new BugzillaAPI(redHatBugzilla);
  }

  get bugzillaAPI() {
    return this._api;
  }
}
