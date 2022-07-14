import { Review } from './review/review.model';

export class UserReview {
  private _reviews: Review[];
  private _user: string | undefined;

  constructor(review: Review);
  constructor(review: Review, ...resetOfReviews: Review[]) {
    this._reviews = [review, ...resetOfReviews];

    this.user = this.identifyUser();
  }

  get user() {
    return this._user;
  }

  set user(name: string | undefined) {
    this._user = name;
  }

  get reviews() {
    return this._reviews;
  }

  set reviews(reviews: Review[]) {
    this._reviews = reviews;
  }

  /**
   * It's expected, that validation was done prior to instantiating this class
   */
  private identifyUser() {
    return Array.isArray(this.reviews) ? this.reviews[0].user : '';
  }

  pushReview(review: Review) {
    return this.reviews.push(review);
  }

  lastReview() {}
  isReviewPositive() {}
  isLgtmApprover() {}
}
