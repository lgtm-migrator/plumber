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
