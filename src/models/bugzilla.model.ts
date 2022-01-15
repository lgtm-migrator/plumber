import BugzillaAPI from 'bugzilla';

export abstract class Bugzilla {
  protected readonly _api: BugzillaAPI;

  constructor() {
    this._api = new BugzillaAPI('https://bugzilla.mozilla.org', '<api key>');
  }

  protected get bugzilla() {
    return this._api;
  }
}
