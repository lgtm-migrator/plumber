import { Context, Probot } from 'probot';

import { isOpened, isUser, plumberPullEvent } from '../services/common.service';

import { PullRequest } from '../models/pullRequest.model';

import { PullRequestObject } from '../types/pullRequest';

export async function handlePullRequestUpdate(
  app: Probot,
  context: Context<typeof plumberPullEvent.edited[number]>
) {
  try {
    // TODO: if is bot check if mergable
    isUser(context.isBot);
    isOpened(
      context.payload.pull_request.state,
      context.payload.pull_request.number
    );

    const pullRequestData: PullRequestObject = PullRequest.composeInput(
      context,
      await PullRequest.getCommits(context)
    );

    const pr = new PullRequest(pullRequestData);

    // if (pr.commitsHaveBugRefs()) {
    //   pr.setTitle(payload.pull_request.title);
    //   pr.removeLabel('needs-bz', context);
    // } else {
    //   pr.setLabel('needs-bz', context);
    // }

    await pr.feedback.publishReview();
  } catch (err) {
    app.log.debug('Error: ', err);
  }
}
