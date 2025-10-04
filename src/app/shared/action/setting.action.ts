import { ISetting } from '../interface/setting.interface';

export class GetSettingOptionAction {
  static readonly type = '[Setting] Get';
}

export class GetBackendSettingOptionAction {
  static readonly type = '[Setting] Backend Get';
}

export class UpdateSettingOptionAction {
  static readonly type = '[Setting] Update';
  constructor(public payload: ISetting) {}
}
