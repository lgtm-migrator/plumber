import { BugzillaFlags } from './bugzilla';

export interface TrackerInterface {
  readonly tracker: 'Bugzilla' | 'Jira';
  readonly id: number /*| string */;
  readonly url: string;

  flags?: Flags;
  status?: Status;

  readonly bugIdRegex: RegExp;

  initialize(): Promise<void>;

  hasBugValid(field: keyof BugzillaObjects): void | never;
  isBugValid(): boolean;

  createComment(content: string, isPrivate?: boolean): Promise<boolean>;
  changeStatus(newStatus: any): Promise<boolean>;
  setFlag(name: string, status: any): Promise<boolean>;
}

export type Status = 'NEW' | 'ASSIGNED' | 'POST' | 'MODIFIED';

export interface Flags {
  develAck: Flag;
  qaAck: Flag;
  release: Flag;
}

interface Flag {
  name?: string;
  status: string;
  approved?: boolean = false;
}
