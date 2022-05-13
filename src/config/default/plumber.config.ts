import { RulesConfiguration } from '../config';

type RecursiveRequired<T> = {
  [P in keyof T]-?: RecursiveRequired<T[P]>;
};

export const defaultRules: RecursiveRequired<RulesConfiguration> = {
  bugzillaReference: {
    blocking: true,
    label: 'needs-bz',
    waiveLabel: null,
  },
  jiraReference: {
    blocking: true,
    label: 'needs-jira',
    waiveLabel: null,
  },
  review: {
    blocking: true,
    label: 'needs-review',
    waiveLabel: null,
  },
  ci: {
    blocking: true,
    label: 'needs-ci',
    waiveLabel: 'ci-waived',
  },
  upstreamReference: {
    blocking: true,
    label: 'needs-upstream',
    waiveLabel: null,
  },
  flags: {
    blocking: true,
    label: 'needs-flags',
    waiveLabel: null,
    flags: ['qa_ack', 'devel_ack', 'release'],
  },
};
