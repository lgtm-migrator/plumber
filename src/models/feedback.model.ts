import metadata from 'probot-metadata';

import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Commit } from './commit.model';

import { Message, FeedbackObject, MessageObject } from '../types/feedback';
import { Tracker, Flags } from '../types/tracker';

// TODO: check if there is something to report, if not, hide/remove?
export class Feedback {
  private _id?: number;
  private _message: Message;
  private _context?: {
    [K in keyof typeof plumberPullEvent]: Context<
      typeof plumberPullEvent[K][number]
    >;
  }[keyof typeof plumberPullEvent];

  constructor();
  constructor(data: FeedbackObject);
  constructor(data?: FeedbackObject) {
    this._message = data ? data.message : {};
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
${this._message.config ?? ''}\n
${this._message.commits ?? ''}\n
${this._message.upstream ?? ''}\n
${this._message.flags ?? ''}\n
${this._message.ci ?? ''}\n
${this._message.reviews ?? ''}\n`;
  }

  set message(newMessage: Message) {
    this._message = newMessage;
  }

  isEmpty() {
    if (!this.message || this.message === {}) {
      return true;
    }

    for (const key in this.message) {
      if (
        !this.message[key as keyof Message] ||
        this.message[key as keyof Message]?.title === ''
      ) {
        return true;
      }
    }

    return false;
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

  setConfigTemplate(
    items: {
      property: string;
      value: string;
      notes?: { [type: string]: string };
    }[]
  ) {
    if (items.length < 1) {
      return;
    }

    this.setCommentSection(
      'config',
      this.composeComment({
        title: '⚠️ *Error when parsing configuration!* ⚠️',
        body: `${this.configTemplate(items)}`,
        note: 'For more information please visit 📖[wiki](https://github.com/jamacku/plumber/wiki/Configuration).',
      })
    );
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

  private commitsTemplate(commits: Commit[]) {
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

  private configTemplate(
    items: {
      property: string;
      value: string;
      notes?: { [type: string]: string };
    }[]
  ) {
    return items
      .map(
        item =>
          `\`${item.property}: ${item.value}\` - *${Object.keys(item.notes!)
            .map(key => `${item.notes![key]}`)
            .join(' | ')}*`
      )
      .join('\r\n');
  }

  async publishReview(
    context: {
      [K in keyof typeof plumberPullEvent]: Context<
        typeof plumberPullEvent[K][number]
      >;
    }[keyof typeof plumberPullEvent]
  ) {
    this._context = context;

    this.id = await this.getReviewID();

    if (this.id) {
      this.updateReviewComment();
      return;
    }

    const reviewPayload = await this.publishReviewComment();

    this.id = reviewPayload?.data.id;
    await this.setReviewID(reviewPayload!.data.id);
  }

  // TODO: Fix this `context as unknown as Context`
  private async getReviewID(): Promise<number | undefined> {
    return await metadata(this._context as unknown as Context).get('review_id');
  }

  private async setReviewID(id: number) {
    await metadata(this._context as unknown as Context).set('review_id', id);
  }

  private publishReviewComment() {
    return this._context?.octokit.pulls.createReview(
      this._context.pullRequest({
        event: 'COMMENT',
        body: this.messageString as string,
      })
    );
  }

  private updateReviewComment() {
    return this._context?.octokit.rest.pulls.updateReview(
      this._context.pullRequest({
        review_id: this.id!,
        body: this.messageString as string,
      })
    );
  }
}
