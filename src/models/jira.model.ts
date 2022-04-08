import { Flags } from '../types/bugzilla';
import { Tracker } from '../types/tracker';

export class Jira implements Tracker {
  constructor(
    readonly id: number,
    readonly url: string,
    readonly tracker: 'Jira' = 'Jira'
  ) {}

  get status() {
    return 'NEW';
  }

  get flags() {
    return {} as Flags;
  }

  fetch() {
    return Promise.resolve();
  }

  hasBugValid(_fieldnpm: string | number | symbol) {
    return;
  }

  isBugValid() {
    return true;
  }

  createComment(_content: string, _isPrivate?: boolean) {
    return Promise.resolve(true);
  }

  changeStatus(_newStatus: any) {
    return Promise.resolve(true);
  }

  setFlag(_name: string, _status: any) {
    return Promise.resolve(true);
  }
}
