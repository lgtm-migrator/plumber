export type PlumberConfig = {
  package?: string;
  config?: ReleaseBranchConfiguration[];

  rules?: RulesConfiguration;
};

export type ReleaseBranchConfiguration = {
  branch?: string;
  release?: string;
};

export type RulesConfiguration = {
  bugzillaReference?: RuleConfiguration;
  jiraReference?: RuleConfiguration;
  review?: RuleConfiguration;
  ci?: RuleConfiguration;
  upstreamReference?: RuleConfiguration;
  flags?: RuleConfiguration & FlagsConfiguration;
};

export type RuleConfiguration = {
  blocking?: boolean;
  label?: string;
  waiveLabel?: ?string;
};

export type FlagsConfiguration = {
  flags?: string[];
};
