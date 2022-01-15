import { Context, Probot } from 'probot';

import { plumberPullEvent } from '../services/common.service';

export async function handlePullRequestInit(
  app: Probot,
  context: Context<typeof plumberPullEvent.init[number]>
) {
  app.log(context.payload);
}
