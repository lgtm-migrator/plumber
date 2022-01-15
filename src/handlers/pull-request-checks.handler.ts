import { Context, Probot } from 'probot';

import { plumberPullEvent } from '../services/common.service';

export async function handlePullRequestChecksInProgress(
  app: Probot,
  context: Context<typeof plumberPullEvent.checksInProgress[number]>
) {
  app.log(context.payload);
}

export async function handlePullRequestChecksCompleted(
  app: Probot,
  context: Context<typeof plumberPullEvent.checksCompleted[number]>
) {
  app.log(context.payload);
}
