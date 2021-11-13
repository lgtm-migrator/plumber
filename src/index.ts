import { Context, Probot } from "probot";

import type { PlumberEvent } from "./models/plumber.event.model";

export = (app: Probot) => {
  const event: PlumberEvent = {
    pullrequestInit: [
      'pull_request.opened',
      'pull_request.reopened'],
    pullrequestLabel: [
      'pull_request.labeled',
      'pull_request.unlabeled']
  };

  app.on(event.pullrequestInit, onPullrequestInit);
  app.on(event.pullrequestInit, onPullrequestLabel);

  // async function onPullrequestChange(context: Context) {
  //   const issueComment = context.issue({
  //     body: "Thanks for opening this issue!",
  //     label: "needs-ci"
  //   });

  //   await context.octokit.issues.createComment(issueComment);
  // }

  async function onPullrequestInit(context: Context) {
  }

  async function onPullrequestLabel(context: Context) {
  }

  /* Log errors */
  app.onError(async (error) => {
    app.log.error(error);
  });
};
