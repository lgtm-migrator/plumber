import { Context, Probot } from 'probot';

import { isOpened, isUser, plumberPullEvent } from '../services/common.service';

import { PullRequest } from '../models/pullRequest.model';

import { PullRequestObject } from '../types/pullRequest';
// import { Bug } from '../models/bug.model';

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

    const { payload } = context;

    const pullRequestData: PullRequestObject = PullRequest.composeInput(
      context,
      await PullRequest.getCommits(context)
    );

    const pr = new PullRequest(pullRequestData);

    if (pr.commitsHaveBugRefs()) {
      pr.setTitle(payload.pull_request.title);
      pr.removeLabel('needs-bz', context);
    } else {
      pr.setLabel('needs-bz', context);
    }

    // pr.verifyBugRef();
    // pr.checkFlags();
    // pr.checkCi();
    // pr.checkReviews();

    // const bug = new Bug({ id: 2060906 });
    // await bug.initialize();
    // console.log(await bug.createComment('First test comment!'));
    // console.log(await bug.bugzillaAPI.getBugs([2060906]).include(['status']));

    await pr.feedback.publishReview();
  } catch (e: any) {
    app.log.debug(e);
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
