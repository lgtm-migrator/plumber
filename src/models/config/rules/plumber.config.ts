import { Rule } from './rule.model';

export type ReleaseBranchConfiguration = {
  branch?: string;
  release?: string;
};

export type RuleConfiguration = {
  blocking?: boolean;
  label?: string;
};

export type FlagsConfiguration = {
  flags?: string[];
};

export type RulesConfiguration = {
  bugzillaReference?: RuleConfiguration;
  jiraReference?: RuleConfiguration;
  review?: RuleConfiguration;
  ci?: RuleConfiguration;
  upstreamReference?: RuleConfiguration;
  flags?: RuleConfiguration & FlagsConfiguration;
};

export type PlumberConfig = {
  package?: string;
  config?: ReleaseBranchConfiguration[];

  rules?: RulesConfiguration;
};

type RecursiveRequired<T> = {
  [P in keyof T]-?: RecursiveRequired<T[P]>;
};

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

export const defaultRules: RecursiveRequired<RulesConfiguration> = {
  bugzillaReference: {
    blocking: true,
    label: 'needs-bz',
  },
  jiraReference: {
    blocking: true,
    label: 'needs-jira',
  },
  review: {
    blocking: true,
    label: 'needs-review',
  },
  ci: {
    blocking: true,
    label: 'needs-ci',
  },
  upstreamReference: {
    blocking: true,
    label: 'needs-upstream',
  },
  flags: {
    blocking: true,
    label: 'needs-flags',
    flags: ['qa_ack', 'devel_ack', 'release'],
  },
};
