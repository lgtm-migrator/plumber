import { Context, Probot } from 'probot';

import { isOpened, isUser, plumberPullEvent } from '../services/common.service';

import { PullRequest } from '../pull-request/pullRequest.model';
import { Config } from '../config/config.model';

import { PullRequestObject } from '../pull-request/pullRequest';
import { PlumberConfig } from '../config/config';

export async function handlePullRequestInit(
  app: Probot,
  context: Context<typeof plumberPullEvent.init[number]>
) {
  try {
    isUser(context.isBot);
    isOpened(
      context.payload.pull_request.state,
      context.payload.pull_request.number
    );

    const config = new Config(
      (await context.config('plumber.yml')) as PlumberConfig
    );

    let feedback = await Config.validate(config);

    if (!feedback.message.isEmpty()) {
      feedback.publishReview(context);
      return;
    }

    const pullRequestData: PullRequestObject = PullRequest.composeInput(
      context,
      await PullRequest.getCommits(context)
    );

    const pr = new PullRequest(context, config, pullRequestData);

    feedback = await PullRequest.validate(pr);

    if (!feedback.message.isEmpty()) {
      feedback.publishReview(context);
      return;
    }

    // if (await pr.verifyBugRef()) {
    //   pr.setTitle(context.payload.pull_request.title);
    //   await pr.verifyFlags();
    // }

    // pr.verifyCommits();
    // pr.verifyCi();
    // pr.verifyReviews();

    // if (pr.isLgtm()) {
    //   pr.feedback.setLgtmTemplate((await pr.getBug())!);
    //   await pr.merge();
    // }

    // await pr.feedback.publishReview();
  } catch (err) {
    app.log.debug((err as Error).message);
  }
}

// export async function checkPull(context: Context) {
//   // TODO fix ANY
//   const { payload, log }: any = context;
//   const { title, head }: any = payload.pull_request;

//   const octokit = new Octokit();

//   // Check Title
//   if (!isBuginTitle(title)) {
//     // Rename Pull-Request
//     log(`title: ${title}`);
//   }

//   // Check CI
//   const statuses = (
//     await octokit.rest.checks.listSuitesForRef(
//       context.repo({
//         owner: 'jamacku',
//         repo: 'ultimate-probot',
//         ref: head.ref,
//       })
//     )
//   ).data;

//   // Only GA
//   let checks = (
//     await octokit.rest.checks.listForRef(
//       context.repo({
//         owner: 'jamacku',
//         repo: 'ultimate-probot',
//         ref: head.ref,
//         filter: 'all',
//       })
//     )
//   ).data;

//   let ciStatusts = statuses.check_suites.map(status => {
//     return {
//       id: status.id,
//       name: status?.app?.slug,
//       status: status.status,
//       conclusion: status.conclusion,
//       created_at: status.created_at,
//       updated_at: status.updated_at,
//     };
//   });
//   console.log(ciStatusts);

//   let checkStatusts = checks.check_runs.map(status => {
//     return {
//       id: status.id,
//       name: status.name,
//       status: status.status,
//       conclusion: status.conclusion,
//       started_at: status.started_at,
//       completed_at: status.completed_at,
//     };
//   });
//   console.log(checkStatusts);

//   // Check Review

//   // Set labels
// }
