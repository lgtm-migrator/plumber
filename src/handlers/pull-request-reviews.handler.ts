import { Context, Probot } from 'probot';

import { plumberPullEvent } from '../services/common.service';

export async function handlePullRequestReviews(
  app: Probot,
  context: Context<typeof plumberPullEvent.reviews[number]>
) {
  app.log(context.payload);
}
