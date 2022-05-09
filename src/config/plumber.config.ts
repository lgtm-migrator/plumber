import { RulesConfiguration } from '../models/config/config';

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
