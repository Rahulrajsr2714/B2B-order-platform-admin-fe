import { Component, inject, viewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import {
  ITableClickedAction,
  ITableConfig,
} from 'src/app/shared/components/ui/b2b-table/model/b2b-table.interface';
import { B2BTable } from 'src/app/shared/components/ui/b2b-table/table';

import { GraduatedPricingModal } from './components/graduated-pricing-modal/graduated-pricing-modal';
import { IB2bProduct } from './models/b2b-product.interface';
import { IGraduatedPricingFormData } from './models/graduated-pricing.interface';
import { B2bProductService } from './service/b2b-product.service';
import { GraduatedPricingService } from './service/graduated-pricing.service';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Params } from '../../shared/interface/core.interface';

@Component({
  selector: 'app-b2b-product',
  templateUrl: './b2b-product.html',
  styleUrls: ['./b2b-product.scss'],
  imports: [PageWrapper, RouterModule, B2BTable, GraduatedPricingModal],
})
export class B2bProduct {
  private router = inject(Router);
  private productService = inject(B2bProductService);
  private graduatedPricingService = inject(GraduatedPricingService);

  private toastr = inject(ToastrService);

  readonly graduatedPricingModal = viewChild<GraduatedPricingModal>(
    'graduatedPricingModal',
  );

  public tableConfig: ITableConfig = {
    columns: [
      // { title: 'No.', dataField: 'no', type: 'no' },
      // {
      //   title: 'image',
      //   dataField: 'product_thumbnail',
      //   class: 'tbl-image',
      //   type: 'image',
      //   placeholder: 'assets/images/product.png',
      // },
      {
        title: 'Product name',
        dataField: 'productName',
        sortable: true,
        sort_direction: 'desc',
      },
      {
        title: 'Code',
        dataField: 'productCode',
        sortable: true,
        sort_direction: 'desc',
      },
      { title: 'status', dataField: 'isActive', type: 'switch' },
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
      {
        label: 'Graduated Pricing',
        actionToPerform: 'graduated-pricing',
        icon: 'ri-price-tag-2-line',
      },
    ],
    data: [] as IB2bProduct[],
    total: 0,
  };

  // ngOnInit() {
  //   // this.getAllProducts();
  // }

  getAllProducts(payload?: Params) {
    this.productService.getProducts(payload).subscribe({
      next: (resp) => {
        this.tableConfig.data = resp ? resp?.data : [];
        this.tableConfig.total = resp ? resp?.total : 0;
      },
      error: (err: Error) => {
        console.error(err);
      },
    });
  }

  onTableChange(data?: Params) {
    this.getAllProducts(data);
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    else if (action.actionToPerform == 'graduated-pricing')
      this.openGraduatedPricing(action.data);
    // else if (action.actionToPerform == 'is_approved') this.approve(action.data);
    // else if (action.actionToPerform == 'status') this.status(action.data);
    // else if (action.actionToPerform == 'delete') this.delete(action.data);
    // else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data);
    // else if (action.actionToPerform == 'duplicate') this.duplicate(action.data);
  }

  edit(data: IB2bProduct) {
    console.warn(data);
    void this.router.navigateByUrl(`/admin/product/edit/${data.id}`);
  }

  openGraduatedPricing(product: IB2bProduct) {
    void this.graduatedPricingModal()?.openModal(product);
  }

  // approve(data: IProduct) {
  //   this.store.dispatch(
  //     new ApproveProductStatusAction(data.id, data.is_approved),
  //   );
  // }

  // status(data: IProduct) {
  //   this.store.dispatch(new UpdateProductStatusAction(data.id, data.status));
  // }

  // delete(data: IProduct) {
  //   this.store.dispatch(new DeleteProductAction(data.id));
  // }

  // deleteAll(ids: number[]) {
  //   this.store.dispatch(new DeleteAllProductAction(ids));
  // }

  // duplicate(ids: number[]) {
  //   this.store.dispatch(new ReplicateProductAction(ids));
  // }
}
