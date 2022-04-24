type RulesConfiguration = {
  blocking: boolean;
  label: string;
};

export interface PlumberConfig {
  package: string;
  mainBranch: 'master' | 'main';
  branchPrefix: string;
  rhel: string[];
  rules: {
    bugzillaReference: RulesConfiguration;
    jiraReference: RulesConfiguration;
    review: RulesConfiguration;
    ci: RulesConfiguration;
    upstreamReference: RulesConfiguration;
    flags: RulesConfiguration & { flags: string[] };
  };
}

export const defaultConfig = {
  package: 'systemd',
  mainBranch: 'main',
  branchPrefix: 'rhel-',
  rhel: ['9.0.0-beta', '9.0.0', '9.1.0'],
  rules: {
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
  },
};
