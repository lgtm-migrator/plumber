import { Context } from 'probot';

// import {} from 'probot-metadata';

type CommitObject = {
  bugRef: string;
  sha: string;
  message: string;
};

/**
 *
 * @param context
 */
export async function renamePullrequest(context: Context) {
  // TODO: Find proper way to do this ( ... as any ) !!!
  const { payload }: any = context;
  const { title } = payload.pull_request;

  /* Get list of commits for given PR */
  const commits: CommitObject[] = await getBugFromCommits(context);

  const { bug, invalidCommits } = validateCommits(commits);

  if (bug) {
    context.octokit.pulls.update(
      context.pullRequest({
        title: `(${bug}) ${title}`,
      })
    );
  } else {
    //set needs bz
  }

  // TODO: mark review by bot to metadata! so It wouldn't spam on PRs
  // TODO: consider to update existing comment or using check status instead of reviews
  if (invalidCommits.length) {
    const reviewComment = invalidBugReferenceTemplate(invalidCommits);

    context.octokit.pulls.createReview(
      context.pullRequest({
        event: 'COMMENT',
        body: reviewComment,
      })
    );
  } else {
    // clean previouse alerts...
  }
}

/**
 *
 * @param title
 * @returns
 */
export function isBuginTitle(title: string) {
  /* Regex '/^\s*\(\#?\d+\)/' check if PR title starts with bug reference e.g. (#123456) or (123456) */
  const bugRegex = /^\s*\(\#?\d+\)/;
  return bugRegex.test(title);
}

/**
 *
 * @param context
 * @returns
 */
async function getBugFromCommits(context: Context) {
  const bugRegex = /(^\s*|\n|\\n)(Resolves|Related): ?(#\d+)$/;

  let commits = (
    await context.octokit.pulls.listCommits(context.pullRequest())
  ).data.map(commit => {
    /* Transform recived object to contain only relevant informations */
    const commitDesc = {
      sha: commit.sha,
      message: commit.commit.message,
    };

    const result = commitDesc.message.match(bugRegex);
    return {
      ...commitDesc,
      bugRef: Array.isArray(result) ? result[3] : '',
    };
  });

  return commits;
}

/**
 *
 * @param commits
 * @returns
 */
function validateCommits(commits: CommitObject[]) {
  let bug: string = '';
  let invalidCommits = commits.filter(commit => {
    if (commit.bugRef && bug.length && commit.bugRef === bug) {
      return false; // Already noted bug reference
    } else if (commit.bugRef && !bug.length) {
      bug = commit.bugRef;
      return false; // First bug reference
    } else {
      return true; // Multiple bug references in one PR or no bug reference
    }
  });
  return { bug, invalidCommits };
}

function invalidBugReferenceTemplate(commits: CommitObject[]) {
  // Do not change following indentation
  const template = `*Following commits are missing proper bugzilla reference!*
---
  
${commits
  .map(commit => {
    let slicedMsg = commit.message.split(/\n/, 1)[0].slice(0, 70);
    const dotDot = '...';

    return slicedMsg.length < 70
      ? `\`\`${slicedMsg}\`\` - ${commit.sha}`
      : `\`\`${slicedMsg}${dotDot}\`\` - ${commit.sha}`;
  })
  .join('\r\n')}
  
---
Please ensure, that all commit messages includes i.e.: _Resolves: #123456789_ or _Related: #123456789_ and only **one bug** is referenced per PR.`;

  return template;
}
