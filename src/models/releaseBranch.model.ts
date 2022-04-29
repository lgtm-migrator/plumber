import { IsString } from 'class-validator';

import { ReleaseBranchConfiguration } from '../config/plumber.config';

export class ReleaseBranch {
  @IsString({ message: `` })
  private _branch?: string;

  @IsString({ message: `` })
  private _release?: string;

  constructor(data: ReleaseBranchConfiguration) {
    this.branch = data.branch;
    this.release = data.release;
  }

  get branch() {
    return this._branch;
  }

  private set branch(value: string | undefined) {
    this._branch = value;
  }

  get release() {
    return this._release;
  }

  private set release(value: string | undefined) {
    // TODO: Connect with PP
    // TODO: Fetch release data
    this._release = value;
  }
}
