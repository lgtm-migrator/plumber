import { Context } from "probot";

export async function renamePullrequest(context: Context) {
    // TODO: Find proper way to do this ( ... as any ) !!!
    const { payload }: any = context;
    const { title } = payload.pull_request;

    const bugRegex = /(^\s*|\n|\\n)(Resolves|Related): ?(#\d+)$/;

    /* Get list of commits for given PR */
    const commits = (await context.octokit.pulls.listCommits(
        context.pullRequest()
    )).data.map(commit => {
        /* Transform recived object to contain only relevant informations */
        const commitDesc = {
            sha: commit.sha,
            message: commit.commit.message
        }

        const result = commitDesc.message.match(bugRegex);
        return {
            ...commitDesc,
            bugRef: Array.isArray(result) ? result[3] : ''
        };
    });

    let bug: string = '';
    let invalidCommits = commits.filter(commit => {
        if (commit.bugRef && bug.length && commit.bugRef === bug) {
            return false; // Already noted bug reference
        } else if (commit.bugRef && !bug.length) {
            bug = commit.bugRef;
            return false; // First bug reference
        } else {
            return true // Multiple bug references in one PR or no bug reference
        }
    });

    if (bug) {
        context.octokit.pulls.update(
            context.pullRequest({
                title: `(${bug}) ${title}`
            })
        );
    } else {
        //set needs bz
    } 

    // TODO mark review by bot to metadata! so It wouldn't spam on PRs
    if (invalidCommits.length) {
        const reviewComment = `
            \`\`\`diff
            - Following commits are missing proper bugzilla reference!
            \`\`\`
            commit name(50) + <sha> 
        `;

        context.octokit.pulls.createReview(
            context.pullRequest({
                event: 'COMMENT',
                body: reviewComment
            })
        );
    }
}

export function isBuginTitle(title: string) {
    /* Regex '/^\s*\(\#?\d+\)/' check if PR title starts with bug reference e.g. (#123456) or (123456) */
    const bugRegex = /^\s*\(\#?\d+\)/;
    return bugRegex.test(title);
}
