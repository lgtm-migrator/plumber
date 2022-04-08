import { Flags } from './bugzilla';

export interface Tracker {
  readonly tracker: 'Bugzilla' | 'Jira';
  readonly id: number;
  readonly url: string;

  get flags(): Flags | undefined;
  get status(): Status | undefined;

  fetch(): Promise<void>;

  hasBugValid(field: keyof BugzillaObjects): void | never;
  isBugValid(): boolean;

  createComment(content: string, isPrivate?: boolean): Promise<boolean>;
  changeStatus(newStatus: any): Promise<boolean>;
  setFlag(name: string, status: any): Promise<boolean>;
}
