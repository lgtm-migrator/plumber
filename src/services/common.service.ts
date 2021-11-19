import { Context } from "probot";
import { PlumberEvent } from "../models/plumber.event.model";

// import { load } from "js-yaml";
// import { readFile } from "fs/promises";

/* https://probot.github.io/api/latest/classes/context.html#config */
export async function loadPlumberConfig(context: Context) {
    // const defaultConfig = load(await readFile('./plumber.default.yml', "utf8")) as PlumberConfig;
    // return await getConfig(context, 'plumber.yml', config);
    return await context.config('plumber.yml')
}

export async function renamePullrequest(context: Context) {
    // TODO: Find proper way to do this ( ... as any ) !!!
    const payload = (context.payload as any);
    if (!isBuginTitle(payload.pull_request.title)) {
        getBugReferenceFromCommits(await (context.octokit as any).pulls.listCommits({
            owner: (payload.repository.owner.login as string),
            repo: 'test',
            pull_number: 9
        }))
        // try to get bug number
        // apend it to title
        context.log('Dosn\'t contains bug reference');
    }
    context.log('It contains bug reference');
}

export function isBuginTitle(title: string) {
    /* Regex '/^\s*\(\#?\d+\)/' check if PR title starts with bug reference e.g. (#123456) or (123456) */
    const bugRegex = /^\s*\(\#?\d+\)/;
    return bugRegex.test(title);
}

// export function isCiGreen(title: string) {
//     /* Regex '/^\s*\(\#?\d+\)/' check if PR title starts with bug reference e.g. (#123456) or (123456) */
//     const bugRegex = /^\s*\(\#?\d+\)/;
//     return bugRegex.test(title);
// }

export const plumberEvent: PlumberEvent = {
    pullrequestInit: [
        'pull_request.opened',
        'pull_request.reopened',
        'pull_request.synchronize'],
    pullrequestLabel: [
        'pull_request.labeled',
        'pull_request.unlabeled']
};

function getBugReferenceFromCommits(commits: any): string {
    console.log(commits);
    return 'a';
}
