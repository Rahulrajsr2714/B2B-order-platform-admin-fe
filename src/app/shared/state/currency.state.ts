import { Injectable, inject } from '@angular/core';

import { Store, Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  GetCurrenciesAction,
  CreateCurrencyAction,
  EditCurrencyAction,
  UpdateCurrencyAction,
  UpdateCurrencyStatusAction,
  DeleteCurrencyAction,
  DeleteAllCurrencyAction,
} from '../action/currency.action';
import { ICurrency } from '../interface/currency.interface';
import { CurrencyService } from '../services/currency.service';
import { NotificationService } from '../services/notification.service';

export class CurrencyStateModel {
  currency = {
    data: [] as ICurrency[],
    total: 0,
  };
  selectedCurrency: ICurrency | null;
}

@State<CurrencyStateModel>({
  name: 'currency',
  defaults: {
    currency: {
      data: [],
      total: 0,
    },
    selectedCurrency: null,
  },
})
@Injectable()
export class CurrencyState {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private currencyService = inject(CurrencyService);

  @Selector()
  static currency(state: CurrencyStateModel) {
    return state.currency;
  }

  @Selector()
  static currencies(state: CurrencyStateModel) {
    return state.currency.data.map(res => {
      return { label: res?.code, value: res?.id };
    });
  }

  @Selector()
  static selectedCurrency(state: CurrencyStateModel) {
    return state.selectedCurrency;
  }

  @Action(GetCurrenciesAction)
  getCurrencies(ctx: StateContext<CurrencyStateModel>, action: GetCurrenciesAction) {
    return this.currencyService.getCurrencies(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            currency: {
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

  @Action(CreateCurrencyAction)
  create(_ctx: StateContext<CurrencyStateModel>, _action: CreateCurrencyAction) {
    // Currency Create Logic Here
  }

  @Action(EditCurrencyAction)
  edit(ctx: StateContext<CurrencyStateModel>, { id }: EditCurrencyAction) {
    return this.currencyService.getCurrencies().pipe(
      tap({
        next: results => {
          const state = ctx.getState();
          const result = results.data.find(currency => currency.id == id);
          ctx.patchState({
            ...state,
            selectedCurrency: result,
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(UpdateCurrencyAction)
  update(
    _ctx: StateContext<CurrencyStateModel>,
    { payload: _payload, id: _id }: UpdateCurrencyAction,
  ) {
    // Currency Updtae Logic Here
  }

  @Action(UpdateCurrencyStatusAction)
  updateStatus(
    _ctx: StateContext<CurrencyStateModel>,
    { id: _id, status: _status }: UpdateCurrencyStatusAction,
  ) {
    // Currency Update Status Logic Here
  }

  @Action(DeleteCurrencyAction)
  delete(_ctx: StateContext<CurrencyStateModel>, { id: _id }: DeleteCurrencyAction) {
    // Currency Delete Logic Here
  }

  @Action(DeleteAllCurrencyAction)
  deleteAll(_ctx: StateContext<CurrencyStateModel>, { ids: _ids }: DeleteAllCurrencyAction) {
    // Currency Multiple Delete Logic Here
  }
}
