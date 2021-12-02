import { Context } from 'probot';
import { Octokit } from '@octokit/rest';

// import { metadata } from "probot-metadata";

import { isBuginTitle } from './rename.pull.service';

export async function checkPull(context: Context) {
  // TODO fix ANY
  const { payload, log }: any = context;
  const { title, head }: any = payload.pull_request;

  const octokit = new Octokit();

  // Check Title
  if (!isBuginTitle(title)) {
    // Rename Pull-Request
    log(`title: ${title}`);
  }

  // Check CI
  const statuses = (
    await octokit.rest.checks.listSuitesForRef(
      context.repo({
        owner: 'jamacku',
        repo: 'ultimate-probot',
        ref: head.ref,
      })
    )
  ).data;

  // Only GA
  let checks = (
    await octokit.rest.checks.listForRef(
      context.repo({
        owner: 'jamacku',
        repo: 'ultimate-probot',
        ref: head.ref,
        filter: 'all',
      })
    )
  ).data;

  let ciStatusts = statuses.check_suites.map(status => {
    return {
      id: status.id,
      name: status?.app?.slug,
      status: status.status,
      conclusion: status.conclusion,
      created_at: status.created_at,
      updated_at: status.updated_at,
    };
  });
  console.log(ciStatusts);

  let checkStatusts = checks.check_runs.map(status => {
    return {
      id: status.id,
      name: status.name,
      status: status.status,
      conclusion: status.conclusion,
      started_at: status.started_at,
      completed_at: status.completed_at,
    };
  });
  console.log(checkStatusts);

  // Check Review

  // Set labels
}
