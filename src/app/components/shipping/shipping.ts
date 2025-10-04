import { CommonModule } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ShippingCountryModal } from './modal/shipping-country-modal/shipping-country-modal';
import { DeleteShippingAction, GetShippingsAction } from '../../shared/action/shipping.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { DeleteModal } from '../../shared/components/ui/modal/delete-modal/delete-modal';
import { NoData } from '../../shared/components/ui/no-data/no-data';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { IShipping, IShippingModel } from '../../shared/interface/shipping.interface';
import { ShippingState } from '../../shared/state/shipping.state';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.html',
  styleUrls: ['./shipping.scss'],
  imports: [
    PageWrapper,
    HasPermissionDirective,
    RouterModule,
    NoData,
    ShippingCountryModal,
    DeleteModal,
    CommonModule,
    TranslateModule,
  ],
})
export class Shipping {
  private store = inject(Store);

  shipping$: Observable<IShippingModel> = inject(Store).select(
    ShippingState.shipping,
  ) as Observable<IShippingModel>;

  readonly CountryShippingModal = viewChild<ShippingCountryModal>('countryShippingModal');
  readonly DeleteModal = viewChild<DeleteModal>('deleteModal');

  constructor() {
    this.store.dispatch(new GetShippingsAction());
  }

  delete(actionType: string, data: IShipping) {
    this.store.dispatch(new DeleteShippingAction(data?.id));
  }
}
