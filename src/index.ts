import { Context, Probot } from "probot";

import { plumberEvent } from "./services/common.service";

export = (app: Probot) => {
    app.on(plumberEvent.pullrequestInit, onPullrequestInit);
    app.on(plumberEvent.pullrequestInit, onPullrequestLabel);

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
