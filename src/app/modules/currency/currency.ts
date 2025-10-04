import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import {
  ITableClickedAction,
  ITableConfig,
} from 'src/app/shared/components/ui/b2b-table/model/b2b-table.interface';
import { B2BTable } from 'src/app/shared/components/ui/b2b-table/table';

import { ICurrency } from './models/currency.interface';
import { CurrencyService } from './service/currency.service';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Params } from '../../shared/interface/core.interface';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.html',
  styleUrls: ['./currency.scss'],
  imports: [PageWrapper, RouterModule, B2BTable, TranslateModule],
})
export class Currency {
  router = inject(Router);
  currencyService = inject(CurrencyService);
  private modalService = inject(NgbModal);

  public tableConfig: ITableConfig = {
    columns: [
      { title: 'No.', dataField: 'no', type: 'no' },
      {
        title: 'code',
        dataField: 'currencyCode',
        sortable: true,
        sort_direction: 'desc',
      },
      { title: 'symbol', dataField: 'currencySymbol' },
      { title: 'exchange_rate', dataField: 'exchangeRate' },
      {
        title: 'status',
        dataField: 'isActive',
        type: 'switch',
        variant: 'boolean',
      },
    ],
    rowActions: [
      {
        label: 'Edit',
        actionToPerform: 'edit',
        icon: 'ri-pencil-line',
        permission: 'currency.edit',
      },
      {
        label: 'Delete',
        actionToPerform: 'delete',
        icon: 'ri-delete-bin-line',
        permission: 'currency.destroy',
      },
    ],
    data: [] as ICurrency[],
    total: 0,
  };

  getAllCurencies(payload?: Params) {
    this.currencyService.getCurrencies(payload).subscribe({
      next: (resp) => {
        this.tableConfig.data = resp ? resp?.data : [];
        this.tableConfig.total = resp ? resp?.total : 0;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  onTableChange(data?: Params) {
    console.warn(data);
    this.getAllCurencies(data);
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    else if (action.actionToPerform == 'isActive') this.status(action.data);
    else if (action.actionToPerform == 'delete') this.delete(action.data);
    /* else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data); */
  }

  edit(data: ICurrency) {
    console.warn(data);
    void this.router.navigate([`/admin/currency/edit/${data.id}`], {
      state: { data },
    });
  }

  status(data: ICurrency) {
    console.warn(data);
    this.currencyService
      .update(data.id, { isActive: data.isActive })
      .subscribe({
        complete: () => {
          this.modalService.dismissAll();
        },
      });
    /* this.store.dispatch(new UpdateCurrencyStatusAction(data.id, data.status)); */
  }

  delete(data: ICurrency) {
    this.currencyService.deleteCurrency(data.id).subscribe({
      complete: () => {
        this.modalService.dismissAll();
        this.getAllCurencies();
      },
    });
  }

  /* deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllCurrencyAction(ids));
  } */
}
