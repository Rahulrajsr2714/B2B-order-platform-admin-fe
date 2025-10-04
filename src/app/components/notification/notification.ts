import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  GetNotificationAction,
  MarkAsReadNotificationAction,
} from '../../shared/action/notification.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { INotification } from '../../shared/interface/notification.interface';
import { NotificationState } from '../../shared/state/notification.state';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss'],
  imports: [PageWrapper, CommonModule, DatePipe],
})
export class Notification {
  private store = inject(Store);
  private platformId = inject<Object>(PLATFORM_ID);

  notification$: Observable<INotification[]> = inject(Store).select(NotificationState.notification);

  constructor() {
    this.store.dispatch(new GetNotificationAction());
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new MarkAsReadNotificationAction());
    }
  }
}
