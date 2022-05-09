import { Context, Probot } from 'probot';

import { isOpened, isUser, plumberPullEvent } from '../services/common.service';

// import { PullRequest } from '../models/pullRequest.model';
import { Config } from '../models/config/config.model';

// import { PullRequestObject } from '../types/pullRequest';
import { PlumberConfig } from '../models/config/config';

export async function handlePullRequestUpdate(
  app: Probot,
  context: Context<typeof plumberPullEvent.edited[number]>
) {
  try {
    // TODO: if is bot check if mergable
    isUser(context.isBot);
    isOpened(
      context.payload.pull_request.state,
      context.payload.pull_request.number
    );

    const config = new Config(
      (await context.config('plumber.yml')) as PlumberConfig
    );

    Config.validate(config);

    // const pullRequestData: PullRequestObject = PullRequest.composeInput(
    //   context,
    //   await PullRequest.getCommits(context)
    // );

    // const pr = new PullRequest(context, config, pullRequestData);

    // if (pr.commitsHaveBugRefs()) {
    //   pr.setTitle(payload.pull_request.title);
    //   pr.removeLabel('needs-bz', context);
    // } else {
    //   pr.setLabel('needs-bz', context);
    // }

    // await pr.feedback.publishReview(context);
  } catch (err) {
    app.log.debug('Error: ', err);
  }
}
