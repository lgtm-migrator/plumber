import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

export type ReviewObject = {
  context: Context<typeof plumberPullEvent.edited[number]>;
  id?: number;
  message?: string;
};
