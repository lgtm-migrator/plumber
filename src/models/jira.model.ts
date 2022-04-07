import { Trackers } from '../types/trackers';

export class Jira implements Trackers {
  constructor(readonly id: number, readonly url: string) {}

  fetch() {
    return Promise.resolve();
  }

  isBugValid() {
    return Promise.resolve(true);
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
