import { Component, inject, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  DeleteAllTagAction,
  DeleteTagAction,
  GetTagsAction,
  UpdateTagStatusAction,
} from '../../shared/action/tag.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { Params } from '../../shared/interface/core.interface';
import { ITableClickedAction, ITableConfig } from '../../shared/interface/table.interface';
import { ITag, ITagModel } from '../../shared/interface/tag.interface';
import { TagState } from '../../shared/state/tag.state';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
  styleUrls: ['./tag.scss'],
  imports: [PageWrapper, HasPermissionDirective, RouterModule, Table, TranslateModule],
})
export class Tag {
  private store = inject(Store);
  router = inject(Router);

  tag$: Observable<ITagModel> = inject(Store).select(TagState.tag);

  readonly tagType = input<string | null>('product');

  public tableConfig: ITableConfig = {
    columns: [
      { title: 'No.', dataField: 'no', type: 'no' },
      { title: 'name', dataField: 'name', sortable: true, sort_direction: 'desc' },
      {
        title: 'created_at',
        dataField: 'created_at',
        type: 'date',
        sortable: true,
        sort_direction: 'desc',
      },
      { title: 'status', dataField: 'status', type: 'switch' },
    ],
    rowActions: [
      { label: 'Edit', actionToPerform: 'edit', icon: 'ri-pencil-line', permission: 'tag.edit' },
      {
        label: 'Delete',
        actionToPerform: 'delete',
        icon: 'ri-delete-bin-line',
        permission: 'tag.destroy',
      },
    ],
    data: [] as ITag[],
    total: 0,
  };

  ngOnInit() {
    this.tag$.subscribe(tag => {
      this.tableConfig.data = tag ? tag?.data : [];
      this.tableConfig.total = tag ? tag?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    data!['type'] = this.tagType()!;
    this.store.dispatch(new GetTagsAction(data));
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    else if (action.actionToPerform == 'status') this.status(action.data);
    else if (action.actionToPerform == 'delete') this.delete(action.data);
    else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data);
  }

  edit(data: ITag) {
    if (this.tagType() == 'post') void this.router.navigateByUrl(`/blog/tag/edit/${data.id}`);
    else void this.router.navigateByUrl(`/tag/edit/${data.id}`);
  }

  status(data: ITag) {
    this.store.dispatch(new UpdateTagStatusAction(data.id, data.status));
  }

  delete(data: ITag) {
    this.store.dispatch(new DeleteTagAction(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllTagAction(ids));
  }
}
