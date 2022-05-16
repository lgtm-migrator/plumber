import metadata from 'probot-metadata';

import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { FeedbackObject } from './feedback';
import { Message } from './message/message.model';

// TODO: check if there is something to report, if not, hide/remove?
export class Feedback {
  private _id?: number;
  private _message: Message;
  private _context!: {
    [K in keyof typeof plumberPullEvent]: Context<
      typeof plumberPullEvent[K][number]
    >;
  }[keyof typeof plumberPullEvent];

  constructor();
  constructor(data: FeedbackObject);
  constructor(data?: FeedbackObject) {
    this._message = data ? data.message : new Message();
  }

  private get id() {
    return this._id;
  }

  private get context() {
    return this._context;
  }

  private set context(
    value: {
      [K in keyof typeof plumberPullEvent]: Context<
        typeof plumberPullEvent[K][number]
      >;
    }[keyof typeof plumberPullEvent]
  ) {
    this._context = value;
  }

  private set id(newID: number | undefined) {
    this._id = newID;
  }

  get message() {
    return this._message;
  }

  async publishReview(
    context: {
      [K in keyof typeof plumberPullEvent]: Context<
        typeof plumberPullEvent[K][number]
      >;
    }[keyof typeof plumberPullEvent]
  ) {
    this.context = context;

    this.id = await this.getReviewID();

    if (this.id) {
      this.updateReviewComment();
      return;
    }

    const reviewPayload = await this.publishReviewComment();

    this.id = reviewPayload?.data.id;
    await this.setReviewID(reviewPayload!.data.id);
  }

  private async getReviewID(): Promise<number | undefined> {
    return await metadata(this.context as unknown as Context).get('review_id');
  }

  private async setReviewID(id: number) {
    await metadata(this.context as unknown as Context).set('review_id', id);
  }

  private publishReviewComment() {
    if (this.message.toString === '') return;

    return this.context.octokit.pulls.createReview(
      this.context.pullRequest({
        event: 'COMMENT',
        body: this.message.toString,
      })
    );
  }

  private updateReviewComment() {
    return this.context.octokit.rest.pulls.updateReview(
      this.context.pullRequest({
        review_id: this.id!,
        body: this.message.toString,
      })
    );
  }
}
