import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  ApproveProductStatusAction,
  DeleteAllProductAction,
  DeleteProductAction,
  GetProductsAction,
  ReplicateProductAction,
  UpdateProductStatusAction,
} from '../../shared/action/product.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { Params } from '../../shared/interface/core.interface';
import { IProduct, IProductModel } from '../../shared/interface/product.interface';
import { ITableClickedAction, ITableConfig } from '../../shared/interface/table.interface';
import { ProductState } from '../../shared/state/product.state';

@Component({
  selector: 'app-product',
  templateUrl: './product.html',
  styleUrls: ['./product.scss'],
  imports: [PageWrapper, HasPermissionDirective, RouterModule, Table, TranslateModule],
})
export class Product {
  private store = inject(Store);
  private router = inject(Router);

  product$: Observable<IProductModel> = inject(Store).select(ProductState.product);

  public tableConfig: ITableConfig = {
    columns: [
      { title: 'No.', dataField: 'no', type: 'no' },
      {
        title: 'image',
        dataField: 'product_thumbnail',
        class: 'tbl-image',
        type: 'image',
        placeholder: 'assets/images/product.png',
      },
      { title: 'name', dataField: 'name', sortable: true, sort_direction: 'desc' },
      { title: 'sku', dataField: 'sku', sortable: true, sort_direction: 'desc' },
      {
        title: 'price',
        dataField: 'sale_price',
        type: 'price',
        sortable: true,
        sort_direction: 'desc',
      },
      { title: 'stock', dataField: 'stock' },
      { title: 'store', dataField: 'store_name' },
      { title: 'approved', dataField: 'is_approved', type: 'switch', canAllow: ['admin'] },
      { title: 'status', dataField: 'status', type: 'switch' },
    ],
    rowActions: [
      {
        label: 'Edit',
        actionToPerform: 'edit',
        icon: 'ri-pencil-line',
        permission: 'product.edit',
      },
      {
        label: 'Delete',
        actionToPerform: 'delete',
        icon: 'ri-delete-bin-line',
        permission: 'product.destroy',
      },
    ],
    data: [] as IProduct[],
    total: 0,
  };

  ngOnInit() {
    this.product$.subscribe(product => {
      let products = product?.data?.filter((element: IProduct) => {
        element.stock = element.stock_status
          ? `<div class="status-${element.stock_status}"><span>${element.stock_status.replace(/_/g, ' ')}</span></div>`
          : '-';
        element.store_name = element?.store ? element?.store?.store_name : '-';
        return element;
      });
      this.tableConfig.data = product ? products : [];
      this.tableConfig.total = product ? product?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetProductsAction(data));
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    else if (action.actionToPerform == 'is_approved') this.approve(action.data);
    else if (action.actionToPerform == 'status') this.status(action.data);
    else if (action.actionToPerform == 'delete') this.delete(action.data);
    else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data);
    else if (action.actionToPerform == 'duplicate') this.duplicate(action.data);
  }

  edit(data: IProduct) {
    void this.router.navigateByUrl(`/product/edit/${data.id}`);
  }

  approve(data: IProduct) {
    this.store.dispatch(new ApproveProductStatusAction(data.id, data.is_approved));
  }

  status(data: IProduct) {
    this.store.dispatch(new UpdateProductStatusAction(data.id, data.status));
  }

  delete(data: IProduct) {
    this.store.dispatch(new DeleteProductAction(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllProductAction(ids));
  }

  duplicate(ids: number[]) {
    this.store.dispatch(new ReplicateProductAction(ids));
  }
}
