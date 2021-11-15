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
    context.log("test");
}

export const plumberEvent: PlumberEvent = {
    issueOpened: [
        'issues.opened',
        'issues.reopened'],
    pullrequestInit: [
        'pull_request.opened',
        'pull_request.reopened'],
    pullrequestLabel: [
        'pull_request.labeled',
        'pull_request.unlabeled']
};
