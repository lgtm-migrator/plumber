import { Context, Probot } from 'probot';

import { isUser, plumberPullEvent } from '../services/common.service';

export async function handlePullRequestChecksInProgress(
  app: Probot,
  context: Context<typeof plumberPullEvent.checksInProgress[number]>
) {
  try {
    isUser(context.isBot);
    // isOpened(
    //   context.payload.pull_request.state,
    //   context.payload.pull_request.number
    // );

    app.log.debug(context.payload);
  } catch (err) {
    app.log.debug('Error: ', err);
  }
}

export async function handlePullRequestChecksCompleted(
  app: Probot,
  context: Context<typeof plumberPullEvent.checksCompleted[number]>
) {
  try {
    isUser(context.isBot);
    // isOpened(
    //   context.payload.pull_request.state,
    //   context.payload.pull_request.number
    // );

    app.log.debug(context.payload);
  } catch (err) {
    app.log.debug('Error: ', err);
  }
}
