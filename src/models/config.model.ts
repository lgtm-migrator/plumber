import { IsString, validate } from 'class-validator';

import { PlumberConfig } from '../config/plumber.config';

export class Config {
  @IsString({
    message: '[Wrong configuration] - "package": "$value"',
  })
  private _package!: string;

  @IsString({
    message: '[Wrong configuration] - "branchPrefix": "$value"',
  })
  private _branchPrefix!: string;

  // TODO: Add validators
  private _rules!: Pick<PlumberConfig, 'rules'>['rules'];

  constructor(private readonly config: PlumberConfig) {
    this.package = this.config.package;
    this.branchPrefix = this.config.branchPrefix;
    this.rules = this.config.rules;
  }

  get package() {
    return this._package;
  }

  set package(name: string) {
    // TODO: If not set, use repository name?
    this._package = name;
  }

  get branchPrefix() {
    return this._branchPrefix;
  }

  set branchPrefix(prefix: string) {
    this._branchPrefix = prefix ?? '';
  }

  get rules() {
    return this._rules;
  }

  set rules(value: Pick<PlumberConfig, 'rules'>['rules']) {
    this._rules = value;
  }

  static validate(config: Config) {
    return validate(config);
  }
}
