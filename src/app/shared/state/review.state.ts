import { Injectable, inject } from '@angular/core';

import { Store, Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  GetReviewsAction,
  DeleteReviewAction,
  DeleteAllReviewAction,
} from '../action/review.action';
import { IReview } from '../interface/review.interface';
import { NotificationService } from '../services/notification.service';
import { ReviewService } from '../services/review.service';

export class ReviewStateModel {
  review = {
    data: [] as IReview[],
    total: 0,
  };
}

@State<ReviewStateModel>({
  name: 'review',
  defaults: {
    review: {
      data: [],
      total: 0,
    },
  },
})
@Injectable()
export class ReviewState {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private reviewService = inject(ReviewService);

  @Selector()
  static review(state: ReviewStateModel) {
    return state.review;
  }

  @Action(GetReviewsAction)
  getReviews(ctx: StateContext<ReviewStateModel>, action: GetReviewsAction) {
    return this.reviewService.getReviews(action?.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            review: {
              data: result.data,
              total: result?.total ? result?.total : result.data ? result.data.length : 0,
            },
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(DeleteReviewAction)
  delete(_ctx: StateContext<ReviewStateModel>, { id: _id }: DeleteReviewAction) {
    // Review Delete Logic Here
  }

  @Action(DeleteAllReviewAction)
  deleteAll(_ctx: StateContext<ReviewStateModel>, { ids: _ids }: DeleteAllReviewAction) {
    // Review Delete All Logic Here
  }
}
