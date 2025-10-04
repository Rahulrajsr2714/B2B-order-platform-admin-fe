import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GetCommissionAction } from '../../shared/action/commission.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { ICommission, ICommissionModel } from '../../shared/interface/commission.interface';
import { Params } from '../../shared/interface/core.interface';
import { CommissionState } from '../../shared/state/commission.state';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.html',
  styleUrls: ['./commission.scss'],
  imports: [PageWrapper, Table],
})
export class Commission {
  private store = inject(Store);
  router = inject(Router);

  commission$: Observable<ICommissionModel> = inject(Store).select(CommissionState.commission);

  public tableConfig = {
    columns: [
      { title: 'No.', dataField: 'no', type: 'no' },
      { title: 'order_id', dataField: 'order_id' },
      { title: 'store_name', dataField: 'store_name' },
      { title: 'admin_commission', dataField: 'admin_commission', type: 'price' },
      { title: 'vendor_commission', dataField: 'vendor_commission', type: 'price' },
      { title: 'created_at', dataField: 'created_at', type: 'date' },
    ],
    data: [] as ICommission[],
    total: 0,
  };

  ngOnInit() {
    this.commission$.subscribe(commission => {
      let commissions = commission?.data?.filter((element: ICommission) => {
        element.store_name = `<span class="text-capitalize">${element.store.store_name}</span>`;
        element.order_id = `<span class="fw-bolder">#${element.order.order_number}</span>`;
        return element;
      });
      this.tableConfig.data = commission ? commissions : [];
      this.tableConfig.total = commission ? commission?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetCommissionAction(data));
  }
}
