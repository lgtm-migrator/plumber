import { ValidateIf, ValidateNested } from 'class-validator';

import { RulesConfiguration } from './plumber.config';

import { Rule } from './rule.model';

/**
 * Based on: How to force class to implement properties that can store undefined value - https://stackoverflow.com/a/72123545/10221282
 */
type RequiredLiteralKeys<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : {} extends Pick<T, K>
    ? never
    : K]: 0;
};

type OptionalLiteralKeys<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : {} extends Pick<T, K>
    ? K
    : never]: 0;
};

type RulesProperties = {
  [K in RequiredLiteralKeys<RulesConfiguration>]: Rule<K>;
} & {
  [K in OptionalLiteralKeys<RulesConfiguration>]-?: Rule<K> | undefined;
};

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
