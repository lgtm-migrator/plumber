import metadata from 'probot-metadata';

import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Commit } from './commit.model';

import { FeedbackMessage, FeedbackObject } from '../types/feedback';
import { Acks } from '../types/bug';
import { BugRef } from '../types/commit';

export class Feedback {
  private _context:
    | Context<typeof plumberPullEvent.edited[number]>
    | Context<typeof plumberPullEvent.init[number]>;
  private _id?: number;
  private _message: FeedbackMessage;

  constructor(data: FeedbackObject) {
    this._context = data.context;
    this._message = data.message;
  }

  private get context() {
    return this._context;
  }

  get id() {
    return this._id;
  }

  set id(newID: number | undefined) {
    this._id = newID;
  }

  get message() {
    return this._message;
  }

  get messageString() {
    if (this._message.general) {
      return this._message.general;
    }

    /* Do not change following indentation! */
    return `
    ${this._message.commits ?? ''}\n
    ${this._message.upstream ?? ''}\n
    ${this._message.flags ?? ''}\n
    ${this._message.ci ?? ''}\n
    ${this._message.reviews ?? ''}\n`;
  }

  set message(newMessage: FeedbackMessage) {
    this._message = newMessage;
  }

  setCommentSection(section: keyof FeedbackMessage, template: string) {
    this.message = {
      ...this.message,
      [section]: template,
    };
  }

  clearCommentSection(section: keyof FeedbackMessage) {
    this.setCommentSection(section, '');
  }

  setCommitsTemplate(commits: Commit[]) {
    /* Do not change following indentation! */
    this.setCommentSection(
      'commits',
      `
⚠️ *Following commits are missing proper bugzilla reference!* ⚠️
---
  
${this.commitsTemplate(commits)}
  
---
Please ensure, that all commit messages includes i.e.: _Resolves: #123456789_ or _Related: #123456789_ and only **one** 🐞 is referenced per PR.`
    );
  }

  setUpstreamTemplate(commits: Commit[]) {
    /* Do not change following indentation! */
    this.setCommentSection(
      'upstream',
      `
⚠️ *Following commits are missing upstream reference or RHEL-only note!* ⚠️
---

${this.commitsTemplate(commits)}

---
Please ensure that all commit messages include i.e.: _(cherry picked from commit abcd)_ or _RHEL-only_ if they are exclusive to RHEL. Otherwise they need to be proposed on [systemd](https://github.com/systemd/systemd) upstream first.`
    );
  }

  setFlagsTemplate(acks: Partial<Acks>) {
    /* Do not change following indentation! */
    this.setCommentSection(
      'flags',
      `
⚠️ *Referenced Bugzilla isn't approved* ⚠️
---
    
- [${acks.develAck === '+' ? 'x' : ' '}] - \`devel_ack\`
- [${acks.qaAck === '+' ? 'x' : ' '}] - \`qa_ack\`
- [${acks.release === '+' ? 'x' : ' '}] - \`release\``
    );
  }

  setCITemplate() {
    /* Do not change following indentation! */
    this.setCommentSection(
      'ci',
      `
⚠️ *CI needs review* ⚠️
---`
    );
  }

  setCodeReviewTemplate() {
    /* Do not change following indentation! */
    this.setCommentSection(
      'reviews',
      `
⚠️ *Code review is required* ⚠️
---`
    );
  }

  setLgtmTemplate(bugRef: BugRef) {
    /* Do not change following indentation! */
    this.setCommentSection(
      'general',
      `
👍 *LGTM* 👍
---
    
- [x] Commit messages in correct form
- [x] Referenced bug - [#${bugRef}](https://bugzilla.redhat.com/show_bug.cgi?id=${bugRef})
- [x] All required flags granted
- [x] PR was reviewed`
    );
  }

  commitsTemplate(commits: Commit[]) {
    return commits
      .map(commit => {
        let slicedMsg = commit.message.split(/\n/, 1)[0].slice(0, 70);
        const dotDot = '...';

        return slicedMsg.length < 70
          ? `\`\`${slicedMsg}\`\` - ${commit.sha}`
          : `\`\`${slicedMsg}${dotDot}\`\` - ${commit.sha}`;
      })
      .join('\r\n');
  }

  async publishReview() {
    this.id = await this.getReviewID();

    if (this.id) {
      this.updateReviewComment();
      return;
    }

    const reviewPayload = await this.publishReviewComment();

    this.id = reviewPayload.data.id;
    await this.setReviewID(reviewPayload.data.id);
  }

  // TODO: Fix this `context as unknown as Context`
  async getReviewID(): Promise<number | undefined> {
    return await metadata(this.context as unknown as Context).get('review_id');
  }

  async setReviewID(id: number) {
    await metadata(this.context as unknown as Context).set('review_id', id);
  }

  publishReviewComment() {
    return this.context.octokit.pulls.createReview(
      this.context.pullRequest({
        event: 'COMMENT',
        body: this.messageString,
      })
    );
  }

  updateReviewComment() {
    return this.context.octokit.rest.pulls.updateReview(
      this.context.pullRequest({
        review_id: this.id!,
        body: this.messageString,
      })
    );
  }
}
