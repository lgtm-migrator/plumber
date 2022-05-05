import { IsBoolean, IsString, ValidateIf } from 'class-validator';

import {
  defaultRules,
  FlagsConfiguration,
  RuleConfiguration,
  RulesConfiguration,
} from './plumber.config';

export class Rule<T extends keyof RulesConfiguration> {
  @IsBoolean({ message: `Is not boolean.` })
  readonly blocking: boolean;

  @IsString({ message: `Is not string.` })
  readonly label: string;

  @ValidateIf(rule => rule.type === 'flags')
  @IsString({ each: true, message: `Is not string.` })
  readonly flags?: string[];

  constructor(readonly type: T, data?: RuleConfiguration & FlagsConfiguration) {
    this.blocking =
      data?.blocking ??
      defaultRules[this.type as keyof RulesConfiguration].blocking!;

    this.label =
      data?.label ?? defaultRules[this.type as keyof RulesConfiguration].label!;

    this.flags =
      this.type === 'flags'
        ? data?.flags ?? defaultRules[this.type as 'flags'].flags
        : undefined;
  }
}
