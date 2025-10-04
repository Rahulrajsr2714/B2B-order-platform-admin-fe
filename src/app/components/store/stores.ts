import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  ApproveStoreStatusAction,
  DeleteAllStoreAction,
  DeleteStoreAction,
  GetStoresAction,
} from '../../shared/action/store.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { Params } from '../../shared/interface/core.interface';
import { IStores, IStoresModel } from '../../shared/interface/store.interface';
import { ITableClickedAction, ITableConfig } from '../../shared/interface/table.interface';
import { StoreState } from '../../shared/state/store.state';

@Component({
  selector: 'app-store',
  templateUrl: './stores.html',
  styleUrls: ['./stores.scss'],
  imports: [PageWrapper, HasPermissionDirective, RouterModule, Table, TranslateModule],
})
export class Stores {
  private store = inject(Store);
  router = inject(Router);

  store$: Observable<IStoresModel> = inject(Store).select(StoreState.store);

  public tableConfig: ITableConfig = {
    columns: [
      {
        title: 'Logo',
        dataField: 'store_logo',
        class: 'tbl-logo-image',
        type: 'image',
        key: 'store_name',
      },
      { title: 'store_name', dataField: 'store_name' },
      { title: 'name', dataField: 'vendor_name' },
      {
        title: 'created_at',
        dataField: 'created_at',
        type: 'date',
        sortable: true,
        sort_direction: 'desc',
      },
      { title: 'approved', dataField: 'is_approved', type: 'switch' },
    ],
    rowActions: [
      { label: 'Edit', actionToPerform: 'edit', icon: 'ri-pencil-line', permission: 'store.edit' },
      {
        label: 'Delete',
        actionToPerform: 'delete',
        icon: 'ri-delete-bin-line',
        permission: 'store.destroy',
      },
    ],
    data: [] as IStores[],
    total: 0,
  };

  ngOnInit() {
    this.store$.subscribe(store => {
      let stores = store?.data?.filter((element: IStores) => {
        element.vendor_name = element.vendor.name;
        return element;
      });
      this.tableConfig.data = stores ? stores : [];
      this.tableConfig.total = store ? store?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetStoresAction(data));
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    else if (action.actionToPerform == 'is_approved') this.approve(action.data);
    else if (action.actionToPerform == 'delete') this.delete(action.data);
    else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data);
  }

  edit(data: IStores) {
    void this.router.navigateByUrl(`/store/edit/${data.id}`);
  }

  approve(data: IStores) {
    this.store.dispatch(new ApproveStoreStatusAction(data.id, data.is_approved));
  }

  delete(data: IStores) {
    this.store.dispatch(new DeleteStoreAction(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllStoreAction(ids));
  }
}
