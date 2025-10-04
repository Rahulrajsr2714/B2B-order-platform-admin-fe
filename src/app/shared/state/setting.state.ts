import { Injectable, inject } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  GetSettingOptionAction,
  GetBackendSettingOptionAction,
  UpdateSettingOptionAction,
} from '../action/setting.action';
import { IValues } from '../interface/setting.interface';
import { NotificationService } from '../services/notification.service';
import { SettingService } from '../services/setting.service';

export class SettingStateModel {
  setting: IValues | null;
  backEndSetting: IValues | null;
}

@State<SettingStateModel>({
  name: 'setting',
  defaults: {
    setting: null,
    backEndSetting: null,
  },
})
@Injectable()
export class SettingState {
  private settingService = inject(SettingService);
  private notificationService = inject(NotificationService);

  @Selector()
  static setting(state: SettingStateModel) {
    return state.setting;
  }

  @Selector()
  static backEndSetting(state: SettingStateModel) {
    return state.backEndSetting;
  }

  @Action(GetSettingOptionAction)
  getSettingOptions(ctx: StateContext<SettingStateModel>) {
    return this.settingService.getSettingOption().pipe(
      tap({
        next: result => {
          ctx.patchState({
            setting: result.values,
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(GetBackendSettingOptionAction)
  getBackendSettingOption(ctx: StateContext<SettingStateModel>) {
    return this.settingService.getBackendSettingOption().pipe(
      tap({
        next: result => {
          ctx.patchState({
            backEndSetting: result.values,
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(UpdateSettingOptionAction)
  UpdateSettingOptionAction(
    _ctx: StateContext<SettingStateModel>,
    _action: UpdateSettingOptionAction,
  ) {
    // Update Setting Logic Here
  }
}
