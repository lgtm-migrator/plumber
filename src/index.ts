import { Context, Probot } from "probot";

import { plumberEvent, renamePullrequest } from "./services/common.service";

export = (app: Probot) => {
    app.on(plumberEvent.issueOpened, onIssueOpened);
    app.on(plumberEvent.pullrequestInit, onPullrequestInit);
    app.on(plumberEvent.pullrequestLabel, onPullrequestLabel);

    async function onIssueOpened(context: Context) {
      const issueComment = context.issue({
        body: "Thanks for opening this issue!"
      });

      await context.octokit.issues.createComment(issueComment);
    }

    async function onPullrequestInit(context: Context) {
        renamePullrequest(context);
    }

    async function onPullrequestLabel(context: Context) {
        const issueComment = context.issue({
            body: "Thanks for opening this issue!"
          });
    
          await context.octokit.issues.createComment(issueComment);
    }

    /* Log errors */
    app.onError(async (error) => {
        app.log.error(error);
    });
};
