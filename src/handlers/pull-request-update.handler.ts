import { Context, Probot } from 'probot';

import { isUser, plumberPullEvent } from '../services/common.service';

import { Commit } from '../models/commit.model';
import { PullRequest } from '../models/pullRequest.model';

import { PullRequestObject } from '../types/pullRequest';

export async function handlePullRequestUpdate(
  app: Probot,
  context: Context<typeof plumberPullEvent.edited[number]>
) {
  try {
    isUser(context.isBot);

    const { payload } = context;

    const commits: Commit[] = await PullRequest.getCommits(context);

    const pullRequestData: PullRequestObject = {
      id: payload.pull_request.id,
      title: { name: payload.pull_request.title },
      body: payload.pull_request.body,
      assignee: payload.pull_request?.assignee?.login,
      milestone: payload.pull_request?.milestone,
      // project: payload.pull_request?.project,
      commits,
    };

    const pr = new PullRequest(pullRequestData);
    const invalidCommits = pr.invalidCommits;

    if (pr.commitsHaveBugRefs()) {
      const newTitle = pr.titleString;

      if (payload.pull_request.title !== newTitle) {
        context.octokit.pulls.update(
          context.pullRequest({
            title: newTitle,
          })
        );
      }

      // remove needs-bz if it's set
    } else {
      // Set needs-bz label if it isn't set
      context.octokit.issues.addLabels(
        context.issue({
          labels: ['needs-bz'],
        })
      );
    }

    // TODO: consider to update existing comment or using check status instead of reviews
    if (invalidCommits?.length) {
      const reviewComment = pr.invalidBugReferenceTemplate(invalidCommits);

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