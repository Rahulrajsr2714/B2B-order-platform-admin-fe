import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GetOrdersAction } from '../../shared/action/order.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { Params } from '../../shared/interface/core.interface';
import { IOrder, IOrderModel } from '../../shared/interface/order.interface';
import { ITableClickedAction, ITableConfig } from '../../shared/interface/table.interface';
import { OrderState } from '../../shared/state/order.state';

@Component({
  selector: 'app-order',
  templateUrl: './order.html',
  styleUrls: ['./order.scss'],
  imports: [PageWrapper, HasPermissionDirective, RouterModule, Table, TranslateModule],
})
export class Order {
  private store = inject(Store);
  private router = inject(Router);

  order$: Observable<IOrderModel> = inject(Store).select(OrderState.order);

  public tableConfig: ITableConfig = {
    columns: [
      { title: 'No.', dataField: 'no', type: 'no' },
      { title: 'order_number', dataField: 'order_id' },
      {
        title: 'order_date',
        dataField: 'created_at',
        type: 'date',
        sortable: true,
        sort_direction: 'desc',
      },
      { title: 'customer_name', dataField: 'consumer_name' },
      { title: 'total_amount', dataField: 'total', type: 'price' },
      { title: 'payment_status', dataField: 'order_payment_status' },
      { title: 'payment_method', dataField: 'payment_mode' },
    ],
    rowActions: [
      { label: 'View', actionToPerform: 'view', icon: 'ri-eye-line', permission: 'order.edit' },
    ],
    data: [],
    total: 0,
  };

  ngOnInit() {
    this.order$.subscribe(order => {
      this.tableConfig.data = order ? order?.data : [];
      this.tableConfig.total = order ? order?.total : 0;
    });

    this.order$.subscribe(order => {
      let orders = order?.data?.filter((element: IOrder) => {
        element.order_id = `<span class="fw-bolder">#${element.order_number}</span>`;
        element.order_payment_status = element.payment_status
          ? `<div class="status-${element.payment_status.toLowerCase()}"><span>${element.payment_status.replace(/_/g, ' ')}</span></div>`
          : '-';
        element.payment_mode = element.payment_method
          ? `<div class="payment-mode"><span>${element.payment_method.replace(/_/g, ' ').toUpperCase()}</span></div>`
          : '-';
        element.consumer_name = `<span class="text-capitalize">${element.consumer.name}</span>`;
        return element;
      });
      this.tableConfig.data = order ? orders : [];
      this.tableConfig.total = order ? order?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetOrdersAction(data!));
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'view') this.view(action.data);
  }

  view(data: IOrder) {
    void this.router.navigateByUrl(`/order/details/${data.order_number}`);
  }
}
