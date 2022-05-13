import {
  IsBoolean,
  IsString,
  ValidateIf,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import {
  FlagsConfiguration,
  RuleConfiguration,
  RulesConfiguration,
} from '../../config';

import { defaultRules } from '../../default/plumber.config';

@ValidatorConstraint({ async: true })
export class ContainsOneOfConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }

    return (args.constraints as string[]).includes(value);
  }
}

export function ContainsOneOf(
  values: string[],
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: values,
      validator: ContainsOneOfConstraint,
    });
  };
}

export class Rule<T extends keyof RulesConfiguration> {
  // TODO: try to use keyof RulesConfiguration
  @ContainsOneOf(
    [
      'bugzillaReference',
      'jiraReference',
      'review',
      'ci',
      'upstreamReference',
      'flags',
    ],
    {
      message: `Not a supported rule.`,
    }
  )
  readonly type: T;

  @IsBoolean()
  readonly blocking!: boolean;

  @IsString()
  readonly label!: string;

  @ValidateIf(rule => rule.waiveLabel !== null)
  @IsString()
  readonly waiveLabel!: string | null;

  @ValidateIf(rule => rule.type === 'flags')
  @IsString({ each: true })
  readonly flags?: string[];

  constructor(type: T, data?: RuleConfiguration & FlagsConfiguration) {
    this.type = type;

    if (!data) {
      return;
    }

    this.blocking =
      data?.blocking ??
      defaultRules[this.type as keyof RulesConfiguration].blocking;

    this.label =
      data?.label ?? defaultRules[this.type as keyof RulesConfiguration].label;

    this.waiveLabel =
      data?.waiveLabel ??
      defaultRules[this.type as keyof RulesConfiguration].waiveLabel;

    this.flags =
      this.type === 'flags'
        ? data?.flags ?? defaultRules[this.type as 'flags'].flags
        : undefined;
  }
}
