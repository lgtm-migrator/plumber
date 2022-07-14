import { Allow } from 'class-validator';

import { ListReviews } from './reviews';

import { UserReview } from './userReview/userReview.model';
import { Review } from './userReview/review/review.model';

import { removeItem } from '../../utility/functions';

export class Reviews {
  @Allow()
  userReviews: UserReview[];

  private _approvedBy: Review[] = [];
  private _rejectedBy: Review[] = [];
  private _commentedBy: Review[] = [];
  private _requestedReviews: Review[] = [];

  constructor(reviews: ListReviews) {
    this.userReviews = this.separateByUser(reviews);
    console.log(this);
    // this._approvedBy = this.approved();
  }

  private separateByUser(reviews: ListReviews): UserReview[] {
    let reducedReviews = reviews;
    let separated: UserReview[] = [];
    let timeout = 200;

    while (reducedReviews.length > 0 && timeout > 0) {
      console.log(`length: ${reducedReviews.length}`);

      let singleUser = new UserReview(
        this.composeReview(reducedReviews.shift()!)
      );

      for (const review of reducedReviews) {
        console.log(`users: ${singleUser.user} - ${review.user?.login}`);

        if (singleUser.user !== review.user?.login) {
          continue;
        }

        reducedReviews = removeItem(reducedReviews, review);
        singleUser.pushReview(this.composeReview(review));
      }

      console.log(singleUser);

      separated.push(singleUser);
      timeout--;
    }
    return separated;
  }

  private composeReview(review: ListReviews[number]) {
    const data = {
      id: review.id,
      user: review.user?.login,
      authorAssociation: review.author_association,
      body: review.body,
      state: review.state,
      submittedAt: review.submitted_at,
    };

    return new Review(data);
  }

  //   isApproved() {
  //     return true;
  //   }

  //   private approved() {
  //     let approvedReviews: Review[] = [];

  //     this.reviews.forEach(review => {
  //       if (review.isApproved()) {
  //         return;
  //       }

  //       approvedReviews.push(review);
  //     });

  //     return approvedReviews;
  //   }
}
