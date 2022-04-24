type FlagValue = '+' | '-' | '?' | '';

export interface BugzillaFlags {
  develAck: FlagValue;
  qaAck: FlagValue;
  release: FlagValue;
}

export interface Validated {
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
