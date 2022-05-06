import { ValidateIf, ValidateNested } from 'class-validator';

import { RulesConfiguration, RulesProperties } from './plumber.config';

import { Rule } from './rule.model';

export class Rules implements RulesProperties {
  @ValidateIf(o => o.bugzillaReference)
  @ValidateNested()
  bugzillaReference: Rule<'bugzillaReference'> | undefined = undefined;

  @ValidateIf(o => o.jiraReference)
  @ValidateNested()
  jiraReference: Rule<'jiraReference'> | undefined = undefined;

  @ValidateIf(o => o.ci)
  @ValidateNested()
  ci: Rule<'ci'> | undefined = undefined;

  @ValidateIf(o => o.review)
  @ValidateNested()
  review: Rule<'review'> | undefined = undefined;

  @ValidateIf(o => o.upstreamReference)
  @ValidateNested()
  upstreamReference: Rule<'upstreamReference'> | undefined = undefined;

  @ValidateIf(o => o.flags)
  @ValidateNested()
  flags: Rule<'flags'> | undefined = undefined;

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
