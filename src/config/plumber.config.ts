export interface PlumberConfig {
  repository: string;
  requireReview: boolean;
  rhel: string[];
  branchPrefix: string;
  labels: { name: string; blocking: boolean; require: string[] | {}[] }[];
}

export const defaultConfig: PlumberConfig = {
  repository: 'systemd',
  requireReview: true,
  rhel: ['9.0.0-beta', '9.0.0', '9.1.0', '...'],
  branchPrefix: 'rhel-',
  labels: [
    { name: 'needs-bz', blocking: true, require: ['bugzilla'] },
    { name: 'needs-ci', blocking: true, require: ['ci'] },
    { name: 'needs-review', blocking: true, require: ['review'] },
    { name: 'needs-upstream', blocking: true, require: ['upstream'] },
    {
      name: 'needs-acks',
      blocking: true,
      require: [{ flags: ['qa_ack', 'devel_ack', 'release'] }],
    },
  ],
};
