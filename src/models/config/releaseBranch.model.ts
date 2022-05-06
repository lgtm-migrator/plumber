import { IsString } from 'class-validator';

import { ReleaseBranchConfiguration } from './rules/plumber.config';

export class ReleaseBranch {
  @IsString()
  readonly branch?: string;

  @IsString()
  readonly release?: string;

  constructor(data: ReleaseBranchConfiguration) {
    this.branch = data.branch;
    this.release = data.release;
  }
}
