import { CommonModule, SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { INotification } from '../../../../../shared/interface/notification.interface';
import { NavService } from '../../../../../shared/services/nav.service';
import { NotificationState } from '../../../../../shared/state/notification.state';
import { SummaryPipe } from '../../../../pipe/summary.pipe';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss'],
  imports: [RouterModule, CommonModule, SlicePipe, TranslateModule, SummaryPipe],
})
export class Notification {
  navServices = inject(NavService);

  notification$: Observable<INotification[]> = inject(Store).select(NotificationState.notification);

  public unreadNotificationCount: number;
  public active: boolean = false;

  constructor() {
    this.notification$.subscribe(notification => {
      this.unreadNotificationCount = notification?.filter(item => !item.read_at)?.length;
    });
  }

  clickHeaderOnMobile() {
    this.active = !this.active;
  }
}
