import { Trackers } from '../types/trackers';

export class Bug {
  constructor(private readonly tracker: Trackers) {}

  // get id() {
  //   if (this._id === undefined) {
  //     throw new Error(`Invalid bug reference: "${this._id}"`);
  //   }

  //   return this._id;
  // }
}
