import { Context, Probot } from "probot";

/* For more information on building apps:
 * https://probot.github.io/docs/
 * To get your app running against GitHub, see:
 * https://probot.github.io/docs/development/
 */

export = (app: Probot) => {
  app.on([
    'pull_request',
    'pull_request.edited',
    'pull_request.reopened',
    'pull_request.labeled',
    'pull_request.unlabeled',
    'pull_request_review_comment.created',
    'pull_request.review_request_removed',
    'pull_request.review_requested'], onPullrequestChange);

  /* Log errors */
  app.onError(async (error) => {
    app.log.error(error);
  });

  async function onPullrequestChange(context: Context) {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
      label: "needs-ci"
    });

    await context.octokit.issues.createComment(issueComment);
  }
};
