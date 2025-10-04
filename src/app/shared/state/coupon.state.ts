import { Injectable, inject } from '@angular/core';

import { Store, Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  GetCouponsAction,
  CreateCouponAction,
  EditCouponAction,
  UpdateCouponAction,
  UpdateCouponStatusAction,
  DeleteCouponAction,
  DeleteAllCouponAction,
} from '../action/coupon.action';
import { ICoupon } from '../interface/coupon.interface';
import { CouponService } from '../services/coupon.service';
import { NotificationService } from '../services/notification.service';

export class CouponStateModel {
  coupon = {
    data: [] as ICoupon[],
    total: 0,
  };
  selectedCoupon: ICoupon | null;
}

@State<CouponStateModel>({
  name: 'coupon',
  defaults: {
    coupon: {
      data: [],
      total: 0,
    },
    selectedCoupon: null,
  },
})
@Injectable()
export class CouponState {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private couponService = inject(CouponService);

  @Selector()
  static coupon(state: CouponStateModel) {
    return state.coupon;
  }

  @Selector()
  static selectedCoupon(state: CouponStateModel) {
    return state.selectedCoupon;
  }

  @Action(GetCouponsAction)
  getCoupons(ctx: StateContext<CouponStateModel>, action: GetCouponsAction) {
    return this.couponService.getCoupons(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            coupon: {
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

  @Action(CreateCouponAction)
  create(_ctx: StateContext<CouponStateModel>, _action: CreateCouponAction) {
    // Coupon Create Logic Here
  }

  @Action(EditCouponAction)
  edit(ctx: StateContext<CouponStateModel>, { id }: EditCouponAction) {
    return this.couponService.getCoupons().pipe(
      tap({
        next: results => {
          const state = ctx.getState();
          const result = results.data.find(coupon => coupon.id == id);
          ctx.patchState({
            ...state,
            selectedCoupon: result,
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(UpdateCouponAction)
  update(_ctx: StateContext<CouponStateModel>, { payload: _payload, id: _id }: UpdateCouponAction) {
    // Coupon Update Logic Here
  }

  @Action(UpdateCouponStatusAction)
  updateStatus(
    _ctx: StateContext<CouponStateModel>,
    { id: _id, status: _status }: UpdateCouponStatusAction,
  ) {
    // Coupon Update Status Logic Here
  }

  @Action(DeleteCouponAction)
  delete(_ctx: StateContext<CouponStateModel>, { id: _id }: DeleteCouponAction) {
    // Coupon Delete Logic Here
  }

  @Action(DeleteAllCouponAction)
  deleteAll(_ctx: StateContext<CouponStateModel>, { ids: _ids }: DeleteAllCouponAction) {
    // Coupon Multiple Delete Logic Here
  }
}
