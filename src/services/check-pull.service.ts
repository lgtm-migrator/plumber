import { Context } from 'probot';
import { Octokit } from "@octokit/rest";

// import { metadata } from "probot-metadata";

import { isBuginTitle } from './common.service';

export async function checkPull(context: Context) {
    // TODO fix ANY
    const { payload, log }: any = context;
    const { title, head }: any = payload.pull_request;

    const octokit = new Octokit();

    // Check Title
    if (!isBuginTitle(title)) {
        // Rename Pull-Request
        log(`title: ${title}`);
    };

    // Check CI
    const statuses = (await octokit.rest.checks.listSuitesForRef(
        context.repo({
            owner: 'jamacku',
            repo: 'ultimate-probot',
            ref: head.ref
        })
    )).data
    log(`status: ${statuses}`);

    // Check Review

    // Set labels
}