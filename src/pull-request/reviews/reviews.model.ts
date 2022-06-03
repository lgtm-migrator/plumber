import { Review } from './review/review.model';

export class Reviews {
  reviews: Review[];

  constructor(reviews: Review[]) {
    this.reviews = reviews;
  }
}
