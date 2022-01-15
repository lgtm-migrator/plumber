import { Context, Probot } from 'probot';

import { plumberPullEvent } from '../services/common.service';

export async function handlePullRequestLabels(
  app: Probot,
  context: Context<typeof plumberPullEvent.labels[number]>
) {
  app.log(context.payload);
}
