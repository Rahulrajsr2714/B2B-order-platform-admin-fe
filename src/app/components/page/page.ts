import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  DeleteAllPageAction,
  DeletePageAction,
  GetPagesAction,
  UpdatePageStatusAction,
} from '../../shared/action/page.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { Params } from '../../shared/interface/core.interface';
import { IPage, IPageModel } from '../../shared/interface/page.interface';
import { ITableClickedAction, ITableConfig } from '../../shared/interface/table.interface';
import { PageState } from '../../shared/state/page.state';

@Component({
  selector: 'app-page',
  templateUrl: './page.html',
  styleUrls: ['./page.scss'],
  imports: [PageWrapper, HasPermissionDirective, RouterModule, Table, TranslateModule],
})
export class Page {
  private store = inject(Store);
  router = inject(Router);

  page$: Observable<IPageModel> = inject(Store).select(PageState.page);

  public tableConfig: ITableConfig = {
    columns: [
      { title: 'No.', dataField: 'no', type: 'no' },
      { title: 'title', dataField: 'title', sortable: true, sort_direction: 'desc' },
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
      { label: 'Edit', actionToPerform: 'edit', icon: 'ri-pencil-line', permission: 'page.edit' },
      {
        label: 'Delete',
        actionToPerform: 'delete',
        icon: 'ri-delete-bin-line',
        permission: 'page.destroy',
      },
    ],
    data: [] as IPage[],
    total: 0,
  };

  ngOnInit(): void {
    this.page$.subscribe(page => {
      this.tableConfig.data = page ? page?.data : [];
      this.tableConfig.total = page ? page?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetPagesAction(data));
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    else if (action.actionToPerform == 'status') this.status(action.data);
    else if (action.actionToPerform == 'delete') this.delete(action.data);
    else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data);
  }

  edit(data: IPage) {
    void this.router.navigateByUrl(`/page/edit/${data.id}`);
  }

  status(data: IPage) {
    this.store.dispatch(new UpdatePageStatusAction(data.id, data.status));
  }

  delete(data: IPage) {
    this.store.dispatch(new DeletePageAction(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllPageAction(ids));
  }
}
