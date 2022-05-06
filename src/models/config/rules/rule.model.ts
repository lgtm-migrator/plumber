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
  defaultRules,
  FlagsConfiguration,
  RuleConfiguration,
  RulesConfiguration,
} from './plumber.config';

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
      message: `Is not supported rule.`,
    }
  )
  readonly type: T;

  @IsBoolean({ message: `Is not boolean.` })
  readonly blocking?: boolean;

  @IsString({ message: `Is not string.` })
  readonly label?: string;

  @ValidateIf(rule => rule.type === 'flags')
  @IsString({ each: true, message: `Is not string.` })
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

    this.flags =
      this.type === 'flags'
        ? data?.flags ?? defaultRules[this.type as 'flags'].flags
        : undefined;
  }
}
