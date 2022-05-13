import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

export type FeedbackObject = {
  id?: number;
  message: Message;
};

export interface Validation<T> {
  validate(instance: T): Feedback;
}
