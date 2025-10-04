import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GetOrderStatusAction } from '../../shared/action/order-status.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { Params } from '../../shared/interface/core.interface';
import { IOrderStatus, IOrderStatusModel } from '../../shared/interface/order-status.interface';
import { ITableConfig } from '../../shared/interface/table.interface';
import { OrderStatusState } from '../../shared/state/order-status.state';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.html',
  styleUrls: ['./order-status.scss'],
  imports: [PageWrapper, Table],
})
export class OrderStatus {
  private store = inject(Store);
  private router = inject(Router);

  orderStatus$: Observable<IOrderStatusModel> = inject(Store).select(OrderStatusState.orderStatus);

  public tableConfig: ITableConfig = {
    columns: [
      { title: 'No.', dataField: 'no', type: 'no' },
      { title: 'name', dataField: 'name' },
      { title: 'sequence', dataField: 'sequence', sortable: true, sort_direction: 'asc' },
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
      { label: 'Edit', actionToPerform: 'edit', icon: 'ri-pencil-line' },
      { label: 'Delete', actionToPerform: 'delete', icon: 'ri-delete-bin-line' },
    ],
    data: [] as IOrderStatus[],
    total: 0,
  };

  ngOnInit(): void {
    this.orderStatus$.subscribe(orderStatus => {
      this.tableConfig.data = orderStatus ? orderStatus?.data : [];
      this.tableConfig.total = orderStatus ? orderStatus?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetOrderStatusAction(data));
  }
}
