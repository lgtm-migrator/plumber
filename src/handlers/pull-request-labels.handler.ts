import { Context, Probot } from 'probot';

import { isOpened, isUser, plumberPullEvent } from '../services/common.service';

export async function handlePullRequestLabels(
  app: Probot,
  context: Context<typeof plumberPullEvent.labels[number]>
) {
  try {
    isUser(context.isBot);
    isOpened(
      context.payload.pull_request.state,
      context.payload.pull_request.number
    );

    app.log.debug(context.payload);
  } catch (err) {
    app.log.debug('Error: ', err);
  }
}
