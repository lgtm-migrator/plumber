import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

export type FeedbackObject = {
  context:
    | Context<typeof plumberPullEvent.edited[number]>
    | Context<typeof plumberPullEvent.init[number]>;
  id?: number;
  message: Message;
};

export interface Message {
  general?: MessageObject;
  commits?: MessageObject;
  upstream?: MessageObject;
  flags?: MessageObject;
  ci?: MessageObject;
  reviews?: MessageObject;
}

export interface MessageObject {
  title: string;
  body?: string;
  note?: string;
}
