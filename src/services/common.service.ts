import { Context } from 'probot';
import { PlumberEvent } from '../models/plumber.event.model';

// import { load } from "js-yaml";
// import { readFile } from "fs/promises";

/* https://probot.github.io/api/latest/classes/context.html#config */
export async function loadPlumberConfig(context: Context) {
  // const defaultConfig = load(await readFile('./plumber.default.yml', "utf8")) as PlumberConfig;
  // return await getConfig(context, 'plumber.yml', config);
  return await context.config('plumber.yml');
}

// export function isCiGreen(title: string) {
//     /* Regex '/^\s*\(\#?\d+\)/' check if PR title starts with bug reference e.g. (#123456) or (123456) */
//     const bugRegex = /^\s*\(\#?\d+\)/;
//     return bugRegex.test(title);
// }

export const plumberPullEvent: PlumberEvent = {
  init: ['pull_request.opened', 'pull_request.reopened'],
  checksCompleted: [
    'check_run.completed',
    'check_suite.completed',
    'workflow_run.completed',
    'workflow_job.completed',
  ],
  checksInProgress: [
    'check_run.created',
    'check_run.rerequested',
    'check_suite.requested',
    'check_suite.rerequested',
    'workflow_run.requested',
    'workflow_job.in_progress',
    'workflow_job.queued',
    'workflow_job.started',
  ],
  reviews: [
    // 'pull_request.review_requested',
    // 'pull_request_review.dismissed',
    'pull_request_review',
  ],
  labels: ['pull_request.labeled', 'pull_request.unlabeled'],
  edited: ['pull_request.edited', 'pull_request.synchronize'],
};
