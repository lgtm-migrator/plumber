import { Context } from "probot";

// import { load } from "js-yaml";
// import { readFile } from "fs/promises";

/* https://probot.github.io/api/latest/classes/context.html#config */
export async function loadPlumberConfig(context: Context) {
    // const defaultConfig = load(await readFile('./plumber.default.yml', "utf8")) as PlumberConfig;
    // return await getConfig(context, 'plumber.yml', config);
    return await context.config('plumber.yml')
}