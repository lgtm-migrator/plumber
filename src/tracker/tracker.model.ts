import { IsDefined, ValidateNested } from 'class-validator';

// import { ImplementsStatic } from '../services/common.service';

import { Bugzilla } from './bugzilla/bugzilla.model';
// import { Jira } from './jira.tracker.model';

import { TrackerInterface } from './tracker';
// import { Validation } from '../feedback/feedback';

// @ImplementsStatic<Validation<Tracker>()
export class Tracker {
  readonly availableTrackers: TrackerInterface[] = [
    Bugzilla.prototype /*Jira.prototype*/,
  ];

  @IsDefined()
  @ValidateNested()
  private _tracker!: TrackerInterface;

  constructor();
  constructor(id: string | undefined);
  constructor(id?: string | undefined) {
    for (const tracker in this.availableTrackers) {
      if (this.isTracker(id, tracker as unknown as TrackerInterface)) {
        // Based on: How do I make JavaScript Object using a variable String to define the class name? - https://stackoverflow.com/a/38280619/10221282
        this._tracker = eval(`new ${tracker}(${id})`);
      }
    }
  }

  private get tracker() {
    return this._tracker;
  }

  get id() {
    return this.tracker.id;
  }

  get flags() {
    return this.tracker.flags;
  }

  get status() {
    return this.tracker.status;
  }

  get url() {
    return this.tracker.url;
  }

  get type() {
    return this.tracker.tracker;
  }

  private isTracker(
    id: string | undefined | null,
    prototype: TrackerInterface
  ) {
    return id ? this.isIdTrackerReference(id, prototype) : false;
  }

  private isIdTrackerReference(
    id: string | undefined | null,
    prototype: TrackerInterface
  ) {
    const idRegex = prototype.bugIdRegex;

    const result = id?.match(idRegex);
    return Array.isArray(result) ? true : false;
  }
}
