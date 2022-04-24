import metadata from 'probot-metadata';

import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Commit } from './commit.model';

import { Message, FeedbackObject, MessageObject } from '../types/feedback';
import { Tracker, Flags } from '../types/tracker';

export class Feedback {
  private _context:
    | Context<typeof plumberPullEvent.edited[number]>
    | Context<typeof plumberPullEvent.init[number]>;
  private _id?: number;
  private _message: Message;

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

    return `
${this._message.commits ?? ''}\n
${this._message.upstream ?? ''}\n
${this._message.flags ?? ''}\n
${this._message.ci ?? ''}\n
${this._message.reviews ?? ''}\n`;
  }

  set message(newMessage: Message) {
    this._message = newMessage;
  }

  setCommentSection(section: keyof Message, template: string) {
    this.message = {
      ...this.message,
      [section]: template,
    };
  }

  clearCommentSection(section: keyof Message) {
    this.setCommentSection(section, '');
  }

  setCommitsTemplate(commits: Commit[]) {
    this.setCommentSection(
      'commits',
      this.composeComment({
        title:
          '⚠️ *Following commits are missing proper bugzilla reference!* ⚠️',
        body: `${this.commitsTemplate(commits)}`,
        note: 'Please ensure, that all commit messages includes i.e.: _Resolves: #123456789_ or _Related: #123456789_ and only **one** 🐞 is referenced per PR.',
      })
    );
  }

  setUpstreamTemplate(commits: Commit[]) {
    this.setCommentSection(
      'upstream',
      this.composeComment({
        title:
          '⚠️ *Following commits are missing upstream reference or RHEL-only note!* ⚠️',
        body: `${this.commitsTemplate(commits)}`,
        note: 'Please ensure that all commit messages include i.e.: _(cherry picked from commit abcd)_ or _RHEL-only_ if they are exclusive to RHEL. Otherwise they need to be proposed on [systemd](https://github.com/systemd/systemd) upstream first.',
      })
    );
  }

  setFlagsTemplate(data: { flags: Partial<Flags>; bug: Tracker }) {
    this.setCommentSection(
      'flags',
      this.composeComment({
        title: `⚠️ *Referenced ${data.bug.tracker} [#${data.bug.id}](${data.bug.url}) isn't approved* ⚠️`,
        body: `   
- [${data.flags.develAck?.approved ? 'x' : ' '}] \`${
          data.flags.develAck?.name
        }\`
- [${data.flags.qaAck?.approved ? 'x' : ' '}] \`${data.flags.qaAck?.name}\`
- [${data.flags.release?.approved ? 'x' : ' '}] \`${
          data.flags.release?.name
        }\``,
      })
    );
  }

  setCITemplate() {
    this.setCommentSection(
      'ci',
      this.composeComment({ title: '⚠️ *CI needs review* ⚠️' })
    );
  }

  setCodeReviewTemplate() {
    this.setCommentSection(
      'reviews',
      this.composeComment({ title: '⚠️ *Code review is required* ⚠️' })
    );
  }

  setLgtmTemplate(bug: Tracker) {
    this.setCommentSection(
      'general',
      this.composeComment({
        title: '👍 *LGTM* 👍',
        body: `
- [x] Commit messages in correct form
- [x] Referenced bug - [#${bug.id}](${bug.url})
- [x] All required flags granted
- [x] PR was reviewed`,
      })
    );
  }

  private composeComment(data: MessageObject) {
    return `
${data.title}
---

${data.body}

---
${data.note}
    `;
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
        body: this.messageString as string,
      })
    );
  }

  updateReviewComment() {
    return this.context.octokit.rest.pulls.updateReview(
      this.context.pullRequest({
        review_id: this.id!,
        body: this.messageString as string,
      })
    );
  }
}
