import { Context } from 'probot';

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

export const plumberPullEvent = {
  init: ['pull_request.opened' as const, 'pull_request.reopened' as const],
  checksCompleted: [
    'check_run.completed' as const,
    'check_suite.completed' as const,
    'workflow_run.completed' as const,
    'workflow_job.completed' as const,
  ],
  checksInProgress: [
    'check_run.created' as const,
    'check_run.rerequested' as const,
    'check_suite.requested' as const,
    'check_suite.rerequested' as const,
    'workflow_run.requested' as const,
    'workflow_job.in_progress' as const,
    'workflow_job.queued' as const,
    'workflow_job.started' as const,
  ],
  reviews: [
    // 'pull_request.review_requested' as const,
    // 'pull_request_review.dismissed',
    'pull_request_review' as const,
  ],
  labels: ['pull_request.labeled' as const, 'pull_request.unlabeled' as const],
  edited: ['pull_request.edited' as const, 'pull_request.synchronize' as const],
};
