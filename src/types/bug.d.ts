export type BugObject = {
  id?: number;
  status?: string;
  acks?: Acks;
};

type FlagValue = '+' | '-' | '?' | '';

export interface Acks {
  develAck: FlagValue;
  qaAck: FlagValue;
  release: FlagValue;
};
