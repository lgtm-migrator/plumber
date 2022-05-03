import { ValidateNested } from 'class-validator';

import { RulesConfiguration } from './plumber.config';

import { Rule } from './rule.model';

export class Rules {
  @ValidateNested()
  readonly rules: { [K in keyof RulesConfiguration]: Rule<K> };

  constructor(data: RulesConfiguration | undefined) {
    this.rules = data
      ? Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            new Rule(key as keyof RulesConfiguration, value),
          ])
        )
      : {};
  }
}
