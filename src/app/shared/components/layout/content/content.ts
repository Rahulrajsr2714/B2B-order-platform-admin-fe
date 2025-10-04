import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Store } from '@ngxs/store';

import { NavService } from '../../../services/nav.service';
import { Footer } from '../../footer/footer';
import { Header } from '../../header/header';
import { Sidebar } from '../../sidebar/sidebar';
import { GetUserDetailsAction } from './../../../action/account.action';
import { GetBadgesAction } from './../../../action/menu.action';
import { GetNotificationAction } from './../../../action/notification.action';
import { SidebarMenuSkeleton } from '../../ui/skeleton/sidebar-menu-skeleton/sidebar-menu-skeleton';

@Component({
  selector: 'app-content',
  templateUrl: './content.html',
  styleUrls: ['./content.scss'],
  imports: [Header, SidebarMenuSkeleton, Sidebar, RouterModule, Footer],
})
export class Content {
  private store = inject(Store);
  navServices = inject(NavService);
  private platformId = inject<Object>(PLATFORM_ID);

  public isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.store.dispatch(new GetBadgesAction());
    this.store.dispatch(new GetNotificationAction());
    this.store.dispatch(new GetUserDetailsAction()).subscribe({
      complete: () => {
        this.navServices.sidebarLoading = false;
      },
    });
  }
}
