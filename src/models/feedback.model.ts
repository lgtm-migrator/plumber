import metadata from 'probot-metadata';

import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Commit } from './commit.model';

import { FeedbackObject } from '../types/feedback';

export class Feedback {
  private _context:
    | Context<typeof plumberPullEvent.edited[number]>
    | Context<typeof plumberPullEvent.init[number]>;
  private _id?: number;
  private _message?: string;

  constructor(data: FeedbackObject) {
    this._context = data.context;
    this._message = data?.message;
  }

  private get context() {
    return this._context;
  }

  get id() {
    return this._id;
  }

  get message() {
    return this._message ? this._message : '';
  }

  set id(newID: number | undefined) {
    this._id = newID;
  }

  set message(newMessage: string) {
    this._message = newMessage;
  }

  /**
   * Compose comment about invalid bug references
   *
   * @param commits
   * @returns - Composed comment
   */
  invalidBugReferenceTemplate(commits: Commit[]) {
    /* Do not change following indentation! */
    const template = `⚠️ *Following commits are missing proper bugzilla reference!* ⚠️
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
Please ensure, that all commit messages includes i.e.: _Resolves: #123456789_ or _Related: #123456789_ and only **one** 🐞 is referenced per PR.`;

    this.message = template;
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

  // TODO:
  //   async clearReviewComment(
  //     _context: Context<typeof plumberPullEvent.edited[number]>
  //   ) {}

  publishReviewComment() {
    return this.context.octokit.pulls.createReview(
      this.context.pullRequest({
        event: 'COMMENT',
        body: this.message,
      })
    );
  }

  updateReviewComment() {
    return this.context.octokit.rest.pulls.updateReview(
      this.context.pullRequest({ review_id: this.id!, body: this.message })
    );
  }
}
