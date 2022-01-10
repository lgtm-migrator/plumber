import { Context } from 'probot';

import type { HandlerFunction } from '@octokit/webhooks/dist-types/types';

import { plumberPullEvent } from './common.service';

import { Commit } from '../models/commit.model';
import { PullRequest } from '../models/pullRequest.model';

import { PullRequestObject } from '../types/pullRequest';

export const onSynchronize: HandlerFunction<
  typeof plumberPullEvent.edited[number],
  Context
> = async context => {
  const { payload } = context;

  if (context.isBot) {
    return;
  }

  const commits: Commit[] = await getPullRequestCommits(context);

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
  const bugRef = pr.bugRef;
  const invalidCommits = pr.invalidCommits;

  if (bugRef) {
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
};

async function getPullRequestCommits(context: Context) {
  return (
    await context.octokit.pulls.listCommits(context.pullRequest())
  ).data.map(commit => {
    const data = {
      sha: commit.sha,
      message: commit.commit.message,
    };

    return new Commit(data);
  });
}
