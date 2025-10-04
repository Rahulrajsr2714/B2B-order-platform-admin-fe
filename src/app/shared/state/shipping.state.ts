import { Injectable, inject } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  GetShippingsAction,
  CreateShippingAction,
  EditShippingAction,
  UpdateShippingAction,
  DeleteShippingAction,
  CreateShippingRuleAction,
  UpdateShippingRuleAction,
  DeleteShippingRuleAction,
} from '../action/shipping.action';
import { IShipping } from '../interface/shipping.interface';
import { NotificationService } from '../services/notification.service';
import { ShippingService } from '../services/shipping.service';

export class ShippingStateModel {
  shipping = {
    data: [] as IShipping[],
  };
  selectedShipping: IShipping | null;
}

@State<ShippingStateModel>({
  name: 'shipping',
  defaults: {
    shipping: {
      data: [],
    },
    selectedShipping: null,
  },
})
@Injectable()
export class ShippingState {
  private notificationService = inject(NotificationService);
  private shippingService = inject(ShippingService);

  @Selector()
  static shipping(state: ShippingStateModel) {
    return state.shipping;
  }

  @Selector()
  static selectedShipping(state: ShippingStateModel) {
    return state.selectedShipping;
  }

  @Action(GetShippingsAction)
  getShippings(ctx: StateContext<ShippingStateModel>) {
    return this.shippingService.getShippings().pipe(
      tap({
        next: result => {
          ctx.patchState({
            shipping: {
              data: result,
            },
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(CreateShippingAction)
  create(_ctx: StateContext<ShippingStateModel>, _action: CreateShippingAction) {
    // Shipping Create Logic Here
  }

  @Action(EditShippingAction)
  edit(ctx: StateContext<ShippingStateModel>, { id }: EditShippingAction) {
    return this.shippingService.getShippings().pipe(
      tap({
        next: results => {
          const state = ctx.getState();
          const result = results.find(shipping => shipping.id == id);
          ctx.patchState({
            ...state,
            selectedShipping: result,
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(UpdateShippingAction)
  update(
    _ctx: StateContext<ShippingStateModel>,
    { payload: _payload, id: _id }: UpdateShippingAction,
  ) {
    // Shipping Update Logic Here
  }

  @Action(DeleteShippingAction)
  delete(_ctx: StateContext<ShippingStateModel>, { id: _id }: DeleteShippingAction) {
    // Shipping Delete Logic Here
  }

  @Action(CreateShippingRuleAction)
  createRule(_ctx: StateContext<ShippingStateModel>, _action: CreateShippingRuleAction) {
    // Shipping Create Rule Logic Here
  }

  @Action(UpdateShippingRuleAction)
  updateRule(
    _ctx: StateContext<ShippingStateModel>,
    { payload: _payload, id: _id }: UpdateShippingRuleAction,
  ) {
    // Shipping Update Rule Logic Here
  }

  @Action(DeleteShippingRuleAction)
  deleteRule(_ctx: StateContext<ShippingStateModel>, { id: _id }: DeleteShippingRuleAction) {
    // Shipping Delete Rule Logic Here
  }
}
