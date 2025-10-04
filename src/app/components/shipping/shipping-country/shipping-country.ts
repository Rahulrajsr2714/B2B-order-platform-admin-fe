import { CommonModule } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbAccordionToggle,
  NgbCollapse,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { mergeMap, switchMap, takeUntil } from 'rxjs/operators';

import {
  DeleteShippingRuleAction,
  EditShippingAction,
} from '../../../shared/action/shipping.action';
import { PageWrapper } from '../../../shared/components/page-wrapper/page-wrapper';
import { NoData } from '../../../shared/components/ui/no-data/no-data';
import { IShipping } from '../../../shared/interface/shipping.interface';
import { ShippingState } from '../../../shared/state/shipping.state';
import { FormShipping } from '../form-shipping/form-shipping';
import { ShippingRuleModal } from '../modal/shipping-rule-modal/shipping-rule-modal';

@Component({
  selector: 'app-shipping-country',
  templateUrl: './shipping-country.html',
  styleUrls: ['./shipping-country.scss'],
  imports: [
    PageWrapper,
    RouterModule,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionToggle,
    NgbAccordionButton,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    FormShipping,
    NoData,
    ShippingRuleModal,
    CommonModule,
    TranslateModule,
  ],
})
export class ShippingCountry {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  shipping$: Observable<IShipping> = inject(Store).select(
    ShippingState.selectedShipping,
  ) as Observable<IShipping>;

  readonly CreateShippingRuleModal = viewChild<ShippingRuleModal>('createShippingRuleModal');

  public id: number;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
          if (!params['id']) return of();
          return this.store
            .dispatch(new EditShippingAction(params['id']))
            .pipe(mergeMap(() => this.store.select(ShippingState.selectedShipping)));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(shipping => {
        this.id = shipping?.id!;
      });
  }

  delete(actionType: string, data: IShipping) {
    this.store.dispatch(new DeleteShippingRuleAction(data?.id));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
