import { AuthorAssociation } from '@octokit/webhooks-types';
import { ReviewObject } from './review';

export class Review {
  private readonly _id: number;
  private readonly _user: string | undefined;
  private readonly _authorAssociation: AuthorAssociation;
  private readonly _body?: string;
  private readonly _state: string;
  private readonly _submittedAt: string | undefined;

  constructor(data: ReviewObject) {
    this._id = data.id;
    this._user = data.user;
    this._authorAssociation = data.authorAssociation;
    this._body = data.body;
    this._state = data.state;
    this._submittedAt = data.submittedAt;
  }

  get user() {
    return this._user;
  }
}
