import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

export type FeedbackObject = {
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
