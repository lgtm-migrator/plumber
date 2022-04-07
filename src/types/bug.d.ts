import { Bugzilla } from '../models/bugzilla.model';
import { Jira } from '../models/jira.model';

export type BugObject = {
  id?: number;
  status?: string;
  flags?: Flags;
};

type FlagValue = '+' | '-' | '?' | '';

export interface Flags {
  develAck: FlagValue;
  qaAck: FlagValue;
  release: FlagValue;
}

export type BugzillaStatus = 'NEW' | 'ASSIGNED' | 'POST' | 'MODIFIED';
