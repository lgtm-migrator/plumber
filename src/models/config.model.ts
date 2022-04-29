import {
  IsNotEmpty,
  IsString,
  MinLength,
  validate,
  ValidateNested,
} from 'class-validator';

import { PlumberConfig, RulesConfiguration } from '../config/plumber.config';

import { ReleaseBranch } from './releaseBranch.model';
import { Rule } from './rule.model';

export class Config {
  @IsString({
    message: '[Wrong configuration] - "package": "$value" is not a `string`',
  })
  @MinLength(1, {
    message: '[Wrong configuration] - "package": "$value" is an empty `string`',
  })
  private package?: string;

  @ValidateNested()
  private branches?: ReleaseBranch[];

  @IsNotEmpty()
  @ValidateNested()
  private rules?: Rule<keyof RulesConfiguration>[];

  constructor(private readonly config: PlumberConfig) {
    this.package = this.config?.package ?? '';
    this.branches = this.config.config?.map(
      record => new ReleaseBranch(record)
    );
    this.rules = this.composeRules(this.config.rules);
  }

  private composeRules(
    data?: RulesConfiguration
  ): Rule<keyof RulesConfiguration>[] | undefined {
    let rules: Rule<keyof RulesConfiguration>[] | undefined = [];

    if (!data) {
      return undefined;
    }

    for (const key in Object.entries(data)) {
      rules.push(
        new Rule(
          key as keyof RulesConfiguration,
          data[key as keyof RulesConfiguration]
        )
      );
    }

    return rules;
  }

  static validate(config: Config) {
    return validate(config);
  }
}
