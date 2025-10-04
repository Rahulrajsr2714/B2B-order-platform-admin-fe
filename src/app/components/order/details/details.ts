import {
  CommonModule,
  DatePipe,
  isPlatformBrowser,
  NgClass,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Select2Data, Select2Module, Select2UpdateEvent } from 'ng-select2-component';
import { Observable, of, Subject } from 'rxjs';
import { mergeMap, switchMap, takeUntil } from 'rxjs/operators';

import { GetOrderStatusAction } from '../../../shared/action/order-status.action';
import { UpdateOrderStatusAction, ViewOrderAction } from '../../../shared/action/order.action';
import { PageWrapper } from '../../../shared/components/page-wrapper/page-wrapper';
import { IOrderStatus, IOrderStatusModel } from '../../../shared/interface/order-status.interface';
import { IOrder } from '../../../shared/interface/order.interface';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency-symbol.pipe';
import { OrderStatusState } from '../../../shared/state/order-status.state';
import { OrderState } from '../../../shared/state/order.state';

@Component({
  selector: 'app-details',
  templateUrl: './details.html',
  styleUrls: ['./details.scss'],
  imports: [
    NgClass,
    PageWrapper,
    Select2Module,
    RouterModule,
    CommonModule,
    UpperCasePipe,
    TitleCasePipe,
    DatePipe,
    TranslateModule,
    CurrencySymbolPipe,
  ],
})
export class Details {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  orderStatus$: Observable<IOrderStatusModel> = inject(Store).select(OrderStatusState.orderStatus);
  orderStatuses$: Observable<Select2Data> = inject(Store).select(
    OrderStatusState.orderStatuses,
  ) as Observable<Select2Data>;

  public order: IOrder;
  public statuses: IOrderStatus[] = [];
  public isBrowser: boolean;

  private destroy$ = new Subject<void>();

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);
    this.store.dispatch(new GetOrderStatusAction());
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
          if (!params['id']) return of();
          return this.store
            .dispatch(new ViewOrderAction(params['id']))
            .pipe(mergeMap(() => this.store.select(OrderState.selectedOrder)));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(order => {
        this.order = order!;
      });
  }

  updateOrderStatus(data: Select2UpdateEvent) {
    if (data && data?.value) {
      this.store.dispatch(
        new UpdateOrderStatusAction(this.order?.id!, { order_status_id: Number(data?.value) }),
      );
    }
  }

  ngOnDestroy() {
    this.statuses = [];
    this.destroy$.next();
    this.destroy$.complete();
  }
}
