type FlagValue = '+' | '-' | '?' | '';

export interface Flags {
  develAck: FlagValue;
  qaAck: FlagValue;
  release: FlagValue;
}

export type BugzillaStatus = 'NEW' | 'ASSIGNED' | 'POST' | 'MODIFIED';

export interface Verified {
  valid: BugzillaObjects;
  invalid: BugzillaObjects;
}

export type Fields = BugzillaObjects & {
  status?: string;
};

export interface BugzillaObjects {
  flags?: string[];
  itr?: string;
  component?: string;
}
