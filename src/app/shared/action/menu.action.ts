import { Params } from '../interface/core.interface';

export class GetMenuAction {
  static readonly type = '[Menu] Get';
}

export class GetBadgesAction {
  static readonly type = '[Menu] Badges Get';
  constructor(public payload?: Params) {}
}

export class UpdateBadgeValueAction {
  static readonly type = '[Menu] Update Badge';
  constructor(
    public path: string,
    public badgeValue: number,
  ) {}
}
