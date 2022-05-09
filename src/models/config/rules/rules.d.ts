import { Rule } from './rule.model';

import { RulesConfiguration } from './../config';

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

export type RulesProperties = {
  [K in RequiredLiteralKeys<RulesConfiguration>]: Rule<K>;
} & {
  [K in OptionalLiteralKeys<RulesConfiguration>]-?: Rule<K> | undefined;
};
