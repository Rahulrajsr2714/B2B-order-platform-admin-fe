import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  DeleteAllBlogAction,
  DeleteBlogAction,
  GetBlogsAction,
  UpdateBlogStatusAction,
} from '../../shared/action/blog.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { IBlog, IBlogModel } from '../../shared/interface/blog.interface';
import { Params } from '../../shared/interface/core.interface';
import { ITableClickedAction, ITableConfig } from '../../shared/interface/table.interface';
import { BlogState } from '../../shared/state/blog.state';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrls: ['./blog.scss'],
  imports: [PageWrapper, HasPermissionDirective, RouterModule, Table, TranslateModule],
})
export class Blog {
  private store = inject(Store);
  router = inject(Router);

  blog$: Observable<IBlogModel> = inject(Store).select(BlogState.blog);

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
      { label: 'Edit', actionToPerform: 'edit', icon: 'ri-pencil-line', permission: 'blog.edit' },
      {
        label: 'Delete',
        actionToPerform: 'delete',
        icon: 'ri-delete-bin-line',
        permission: 'blog.destroy',
      },
    ],
    data: [] as IBlog[],
    total: 0,
  };

  ngOnInit() {
    this.blog$.subscribe(blog => {
      this.tableConfig.data = blog ? blog?.data : [];
      this.tableConfig.total = blog ? blog?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetBlogsAction(data)).subscribe();
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    else if (action.actionToPerform == 'status') this.status(action.data);
    else if (action.actionToPerform == 'delete') this.delete(action.data);
    else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data);
  }

  edit(data: IBlog) {
    void this.router.navigateByUrl(`/blog/edit/${data.id}`);
  }

  status(data: IBlog) {
    this.store.dispatch(new UpdateBlogStatusAction(data.id, data.status));
  }

  delete(data: IBlog) {
    this.store.dispatch(new DeleteBlogAction(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllBlogAction(ids));
  }
}
