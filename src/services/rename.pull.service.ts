import { Context } from 'probot';

import { Commit } from '../models/commit.model';
import { PullRequest } from '../models/pullRequest.model';

import { PullRequestObject } from '../types/pullRequest';

export async function onSynchronize(context: Context) {
  // TODO: Find proper way to do this ( ... as any ) !!!
  const { payload }: { payload: any } = context;

  if (context.isBot) {
    return;
  }

  const commits: Commit[] = (
    await context.octokit.pulls.listCommits(context.pullRequest())
  ).data.map(commit => {
    const data = {
      sha: commit.sha,
      message: commit.commit.message,
    };

    return new Commit(data);
  });

  const pullRequestData: PullRequestObject = {
    id: payload.pull_request.id,
    title: { name: payload.pull_request.title },
    body: payload.pull_request.body,
    assignee: payload.pull_request?.assignee?.login,
    milestone: payload.pull_request?.milestone,
    project: payload.pull_request?.project,
    commits,
  };

  const pr = new PullRequest(pullRequestData);
  const { bug, invalidCommits } = pr.getCommitsBugRefs();

  if (bug) {
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
  if (invalidCommits.length) {
    const reviewComment = pr.invalidBugReferenceTemplate(invalidCommits);

    // Update previous comment or create new

    context.octokit.pulls.createReview(
      context.pullRequest({
        event: 'COMMENT',
        body: reviewComment,
      })
    );
  } else {
    // clean previouse alerts...
  }
}
