import { ValidateNested } from 'class-validator';

import { RulesConfiguration } from './plumber.config';

import { Rule } from './rule.model';

type RulesProperties = {
  [T in keyof RulesConfiguration]: Rule<T>;
};

export class Rules implements RulesProperties {
  @ValidateNested()
  bugzillaReference?: Rule<'bugzillaReference'> = undefined;

  @ValidateNested()
  jiraReference?: Rule<'jiraReference'> = undefined;

  @ValidateNested()
  ci?: Rule<'ci'> = undefined;

  @ValidateNested()
  review?: Rule<'review'> = undefined;

  @ValidateNested()
  upstreamReference?: Rule<'upstreamReference'> = undefined;

  @ValidateNested()
  flags?: Rule<'flags'> = undefined;

  constructor(data: RulesConfiguration | undefined) {
    if (!data) {
      return;
    }

    Object.entries(data).map(([key, value]) => {
      (<any>this)[key as keyof RulesConfiguration] = new Rule(
        key as keyof RulesConfiguration,
        value
      );
    });
  }
}
