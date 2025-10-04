import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  GetOrdersAction,
  SelectUserAction,
  ViewOrderAction,
  CheckoutAction,
  PlaceOrderAction,
  UpdateOrderStatusAction,
  ClearAction,
} from '../action/order.action';
import { IOrder, IOrderCheckout } from '../interface/order.interface';
import { IUser } from '../interface/user.interface';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';

export class OrderStateModel {
  order = {
    data: [] as IOrder[],
    total: 0,
  };
  selectedOrder: IOrder | null;
  selectedUser: IUser | null;
  checkout: IOrderCheckout | null;
}

@State<OrderStateModel>({
  name: 'order',
  defaults: {
    order: {
      data: [],
      total: 0,
    },
    selectedOrder: null,
    selectedUser: null,
    checkout: null,
  },
})
@Injectable()
export class OrderState {
  private router = inject(Router);
  private orderService = inject(OrderService);
  private userService = inject(UserService);

  @Selector()
  static order(state: OrderStateModel) {
    return state.order;
  }

  @Selector()
  static selectedUser(state: OrderStateModel) {
    return state.selectedUser;
  }

  @Selector()
  static selectedOrder(state: OrderStateModel) {
    return state.selectedOrder;
  }

  @Selector()
  static checkout(state: OrderStateModel) {
    return state.checkout;
  }

  @Action(GetOrdersAction)
  getOrders(ctx: StateContext<OrderStateModel>, action: GetOrdersAction) {
    return this.orderService.getOrders(action?.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            order: {
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

  @Action(SelectUserAction)
  selectUser(ctx: StateContext<OrderStateModel>, { id }: SelectUserAction) {
    return this.userService.getUsers().pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          const user = result.data.find(user => user.id == id);
          ctx.patchState({
            ...state,
            selectedUser: user,
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(ViewOrderAction)
  viewOrder(ctx: StateContext<OrderStateModel>, { id }: ViewOrderAction) {
    return this.orderService.getOrders().pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          const order = result.data.find(order => order.order_number == id);
          ctx.patchState({
            ...state,
            selectedOrder: order,
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(CheckoutAction)
  checkout(ctx: StateContext<OrderStateModel>, _action: CheckoutAction) {
    const state = ctx.getState();

    // It Just Static IValues as per cart default value (When you are using api then you need calculate as per your requirement)
    const order = {
      total: {
        convert_point_amount: -10,
        convert_wallet_balance: -84.4,
        coupon_total_discount: 10,
        points: 300,
        points_amount: 10,
        shipping_total: 0,
        sub_total: 35.19,
        tax_total: 2.54,
        total: 37.73,
        wallet_balance: 84.4,
      },
    };

    ctx.patchState({
      ...state,
      checkout: order,
    });
  }

  @Action(PlaceOrderAction)
  placeOrder(_ctx: StateContext<OrderStateModel>, _action: PlaceOrderAction) {
    void this.router.navigateByUrl(`/order/details/1000`);
  }

  @Action(UpdateOrderStatusAction)
  updateOrderStatus(
    _ctx: StateContext<OrderStateModel>,
    { id: _id, payload: _payload }: UpdateOrderStatusAction,
  ) {
    // Update Order Status Logic Here
  }

  @Action(ClearAction)
  clear(ctx: StateContext<OrderStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      selectedUser: null,
      checkout: null,
    });
  }
}
