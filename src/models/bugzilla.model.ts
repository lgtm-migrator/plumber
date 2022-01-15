import BugzillaAPI from 'bugzilla';

export abstract class Bugzilla {
  readonly _api: BugzillaAPI;

  constructor() {
    this._api = new BugzillaAPI('https://bugzilla.mozilla.org', '<api key>');
  }

  get bugzilla() {
    return this._api;
  }
}
