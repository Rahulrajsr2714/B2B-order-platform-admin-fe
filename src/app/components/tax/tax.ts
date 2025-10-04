import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  DeleteAllTaxAction,
  DeleteTaxAction,
  GetTaxesAction,
  UpdateTaxStatusAction,
} from '../../shared/action/tax.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { Params } from '../../shared/interface/core.interface';
import { ITableClickedAction, ITableConfig } from '../../shared/interface/table.interface';
import { ITax, ITaxModel } from '../../shared/interface/tax.interface';
import { TaxState } from '../../shared/state/tax.state';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.html',
  styleUrls: ['./tax.scss'],
  imports: [PageWrapper, HasPermissionDirective, RouterModule, Table, TranslateModule],
})
export class Tax {
  private store = inject(Store);
  router = inject(Router);

  tax$: Observable<ITaxModel> = inject(Store).select(TaxState.tax);

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
      { label: 'Edit', actionToPerform: 'edit', icon: 'ri-pencil-line', permission: 'tax.edit' },
      {
        label: 'Delete',
        actionToPerform: 'delete',
        icon: 'ri-delete-bin-line',
        permission: 'tax.destroy',
      },
    ],
    data: [] as ITax[],
    total: 0,
  };

  ngOnInit() {
    this.tax$.subscribe(tax => {
      this.tableConfig.data = tax ? tax?.data : [];
      this.tableConfig.total = tax ? tax?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetTaxesAction(data));
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    else if (action.actionToPerform == 'status') this.status(action.data);
    else if (action.actionToPerform == 'delete') this.delete(action.data);
    else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data);
  }

  edit(data: ITax) {
    void this.router.navigateByUrl(`/tax/edit/${data.id}`);
  }

  status(data: ITax) {
    this.store.dispatch(new UpdateTaxStatusAction(data.id, data.status));
  }

  delete(data: ITax) {
    this.store.dispatch(new DeleteTaxAction(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllTaxAction(ids));
  }
}
