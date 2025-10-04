import { Injectable, inject } from '@angular/core';

import { Store, Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  GetStoresAction,
  CreateStoreAction,
  EditStoreAction,
  UpdateStoreAction,
  UpdateStoreStatusAction,
  DeleteStoreAction,
  DeleteAllStoreAction,
  ApproveStoreStatusAction,
} from '../action/store.action';
import { IStores } from '../interface/store.interface';
import { NotificationService } from '../services/notification.service';
import { StoreService } from '../services/store.service';

export class StoreStateModel {
  store = {
    data: [] as IStores[],
    total: 0,
  };
  selectedStore: IStores | null;
}

@State<StoreStateModel>({
  name: 'store',
  defaults: {
    store: {
      data: [],
      total: 0,
    },
    selectedStore: null,
  },
})
@Injectable()
export class StoreState {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private storeService = inject(StoreService);

  @Selector()
  static store(state: StoreStateModel) {
    return state.store;
  }

  @Selector()
  static stores(state: StoreStateModel) {
    return state.store.data.map(store => {
      return { label: store?.store_name, value: store?.id };
    });
  }

  @Selector()
  static selectedStore(state: StoreStateModel) {
    return state.selectedStore;
  }

  @Action(GetStoresAction)
  getStores(ctx: StateContext<StoreStateModel>, action: GetStoresAction) {
    return this.storeService.getStores(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            store: {
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

  @Action(CreateStoreAction)
  create(_ctx: StateContext<StoreStateModel>, _action: CreateStoreAction) {
    // Store Create Logic Here
  }

  @Action(EditStoreAction)
  edit(ctx: StateContext<StoreStateModel>, { id }: EditStoreAction) {
    return this.storeService.getStores().pipe(
      tap({
        next: results => {
          const state = ctx.getState();
          const result = results.data.find(store => store.id == id);
          ctx.patchState({
            ...state,
            selectedStore: result,
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(UpdateStoreAction)
  update(_ctx: StateContext<StoreStateModel>, { payload: _payload, id: _id }: UpdateStoreAction) {
    // Store Update Logic Here
  }

  @Action(UpdateStoreStatusAction)
  updateStatus(
    _ctx: StateContext<StoreStateModel>,
    { id: _id, status: _status }: UpdateStoreStatusAction,
  ) {
    // Store Update Status Logic Here
  }

  @Action(ApproveStoreStatusAction)
  approveStatus(
    _ctx: StateContext<StoreStateModel>,
    { id: _id, status: _status }: ApproveStoreStatusAction,
  ) {
    // Store Approve Status Logic Here
  }

  @Action(DeleteStoreAction)
  delete(_ctx: StateContext<StoreStateModel>, { id: _id }: DeleteStoreAction) {
    // Store Delete Logic Here
  }

  @Action(DeleteAllStoreAction)
  deleteAll(_ctx: StateContext<StoreStateModel>, { ids: _ids }: DeleteAllStoreAction) {
    // Store Delete All Logic Here
  }
}
