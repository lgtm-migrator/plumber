import { IsString } from 'class-validator';

import { ReleaseBranchConfiguration } from './rules/plumber.config';

export class ReleaseBranch {
  @IsString({ message: `` })
  readonly branch?: string;

  @IsString({ message: `` })
  readonly release?: string;

  constructor(data: ReleaseBranchConfiguration) {
    this.branch = data.branch;
    this.release = data.release;
  }
}
