import { Injectable, inject } from '@angular/core';

import { Store, Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  GetTagsAction,
  CreateTagAction,
  EditTagAction,
  UpdateTagAction,
  UpdateTagStatusAction,
  DeleteTagAction,
  DeleteAllTagAction,
} from '../action/tag.action';
import { ITag } from '../interface/tag.interface';
import { NotificationService } from '../services/notification.service';
import { TagService } from '../services/tag.service';

export class TagStateModel {
  tag = {
    data: [] as ITag[],
    total: 0,
  };
  selectedTag: ITag | null;
}

@State<TagStateModel>({
  name: 'tag',
  defaults: {
    tag: {
      data: [],
      total: 0,
    },
    selectedTag: null,
  },
})
@Injectable()
export class TagState {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private tagService = inject(TagService);

  @Selector()
  static tag(state: TagStateModel) {
    return state.tag;
  }

  @Selector()
  static selectedTag(state: TagStateModel) {
    return state.selectedTag;
  }

  @Action(GetTagsAction)
  getTags(ctx: StateContext<TagStateModel>, action: GetTagsAction) {
    return this.tagService.getTags(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            tag: {
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

  @Action(CreateTagAction)
  create(_ctx: StateContext<TagStateModel>, _action: CreateTagAction) {
    // Tag Create Logic here
  }

  @Action(EditTagAction)
  edit(ctx: StateContext<TagStateModel>, { id }: EditTagAction) {
    return this.tagService.getTags().pipe(
      tap({
        next: results => {
          const state = ctx.getState();
          const result = results.data.find(tag => tag.id == id);
          ctx.patchState({
            ...state,
            selectedTag: result,
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(UpdateTagAction)
  update(_ctx: StateContext<TagStateModel>, { payload: _payload, id: _id }: UpdateTagAction) {
    // Tag Update Logic here
  }

  @Action(UpdateTagStatusAction)
  updateStatus(
    _ctx: StateContext<TagStateModel>,
    { id: _id, status: _status }: UpdateTagStatusAction,
  ) {
    // Tag Update Status Logic here
  }

  @Action(DeleteTagAction)
  delete(_ctx: StateContext<TagStateModel>, { id: _id }: DeleteTagAction) {
    // Tag Delete Logic here
  }

  @Action(DeleteAllTagAction)
  deleteAll(_ctx: StateContext<TagStateModel>, { ids: _ids }: DeleteAllTagAction) {
    // Tag Delete All Logic here
  }
}
