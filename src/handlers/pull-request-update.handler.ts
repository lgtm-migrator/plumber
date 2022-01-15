import { Context, Probot } from 'probot';

import { plumberPullEvent } from '../services/common.service';

export async function handlePullRequestUpdate(
  app: Probot,
  context: Context<typeof plumberPullEvent.edited[number]>
) {
  app.log(context.payload);
}
