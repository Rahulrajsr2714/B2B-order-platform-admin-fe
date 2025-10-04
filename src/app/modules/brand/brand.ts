import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  ITableClickedAction,
  ITableConfig,
} from 'src/app/shared/components/ui/b2b-table/model/b2b-table.interface';
import { B2BTable } from 'src/app/shared/components/ui/b2b-table/table';

import { IBrand } from './models/brand.interface';
import { BrandService } from './service/brand.service';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Params } from '../../shared/interface/core.interface';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.html',
  styleUrls: ['./brand.scss'],
  imports: [PageWrapper, RouterModule, B2BTable, TranslateModule],
})
export class Brand {
  router = inject(Router);
  private readonly brandService = inject(BrandService);
  private modalService = inject(NgbModal);

  public tableConfig: ITableConfig = {
    columns: [
      {
        title: 'Logo',
        dataField: 'brandThumbnailKey',
        class: 'tbl-logo-image',
        type: 'image',
        key: 'brandName',
      },
      { title: 'Brand Code', dataField: 'brandCode' },
      { title: 'Brand Name', dataField: 'brandName' },
      {
        title: 'Is Active',
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
        permission: 'store.edit',
      },
      {
        label: 'Delete',
        actionToPerform: 'delete',
        icon: 'ri-delete-bin-line',
        permission: 'store.destroy',
      },
    ],
    data: [] as IBrand[],
    total: 0,
  };

  getAllBrands(payload?: Params) {
    this.brandService.getBrands(payload).subscribe({
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
    this.getAllBrands(data);
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    else if (action.actionToPerform == 'isActive') this.status(action.data);
    /*else if (action.actionToPerform == 'delete') this.delete(action.data);
    else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data); */
  }

  edit(data: IBrand) {
    void this.router.navigateByUrl(`/admin/brand/edit/${data.id}`);
  }

  status(data: IBrand) {
    console.warn(data);
    this.brandService.toggleActive(data.id).subscribe({
      complete: () => {
        this.modalService.dismissAll();
      },
    });
  }

  /* approve(data: IStores) {
    this.store.dispatch(
      new ApproveStoreStatusAction(data.id, data.is_approved),
    );
  }

  delete(data: IStores) {
    this.store.dispatch(new DeleteStoreAction(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllStoreAction(ids));
  } */
}
