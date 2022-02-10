import { Context, Probot } from 'probot';

import { isOpened, isUser, plumberPullEvent } from '../services/common.service';

import { PullRequest } from '../models/pullRequest.model';

import { PullRequestObject } from '../types/pullRequest';

export async function handlePullRequestUpdate(
  app: Probot,
  context: Context<typeof plumberPullEvent.edited[number]>
) {
  try {
    // if is bot check if mergable
    isUser(context.isBot);
    isOpened(
      context.payload.pull_request.state,
      context.payload.pull_request.number
    );

    const { payload } = context;

    const pullRequestData: PullRequestObject = PullRequest.composeInput(
      context,
      await PullRequest.getCommits(context)
    );

    const pr = new PullRequest(pullRequestData);

    if (pr.commitsHaveBugRefs()) {
      pr.setTitle(payload.pull_request.title, context);
      pr.removeLabel('needs-bz', context);
    } else {
      pr.setLabel('needs-bz', context);
    }

    // TODO: consider to update existing comment or using check status instead of reviews
    if (pr.invalidCommits?.length) {
      const reviewComment = pr.invalidBugReferenceTemplate(pr.invalidCommits);

      // Update previous comment or create new

      context.octokit.pulls.createReview(
        context.pullRequest({
          event: 'COMMENT',
          body: reviewComment,
        })
      );
    } else {
      // clean previous alerts...
    }
  } catch (err) {
    app.log.debug('Error: ', err);
  }
}
