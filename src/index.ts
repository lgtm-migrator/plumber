import { Probot } from "probot";

/* For more information on building apps:
 * https://probot.github.io/docs/
 * To get your app running against GitHub, see:
 * https://probot.github.io/docs/development/
 */

export = (app: Probot) => {
  app.on("issues.opened", async (context) => {
    // let config = await loadPlumberConfig(context);

    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
      label: "needs-ci"
    });

    await context.octokit.issues.createComment(issueComment);
  });
};
