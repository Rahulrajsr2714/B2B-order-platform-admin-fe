import { CommonModule } from '@angular/common';
import { Component, DOCUMENT, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { HasPermissionDirective } from '../../directive/has-permission.directive';
import { IAccountUser } from '../../interface/account.interface';
import { INotification } from '../../interface/notification.interface';
import { ILanguage, IValues } from '../../interface/setting.interface';
import { NavService } from '../../services/nav.service';
import { AccountState } from '../../state/account.state';
import { NotificationState } from '../../state/notification.state';
import { SettingState } from '../../state/setting.state';
import { Languages } from './widgets/languages/languages';
import { Mode } from './widgets/mode/mode';
import { Notification } from './widgets/notification/notification';
import { Profile } from './widgets/profile/profile';
import { Search } from './widgets/search/search';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  imports: [
    RouterModule,
    Search,
    HasPermissionDirective,
    Languages,
    Notification,
    Mode,
    Profile,
    CommonModule,
    TranslateModule,
  ],
})
export class Header {
  private document = inject<Document>(DOCUMENT);
  navServices = inject(NavService);

  user$: Observable<IAccountUser> = inject(Store).select(AccountState.user);
  setting$: Observable<IValues | null> = inject(Store).select(SettingState.setting);
  notification$: Observable<INotification[]> = inject(Store).select(NotificationState.notification);

  public unreadNotificationCount: number;

  public active: boolean = false;
  public profileOpen: boolean = false;
  public open: boolean = false;

  public languages: ILanguage[] = [
    {
      language: 'English',
      code: 'en',
      icon: 'us',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr',
    },
  ];

  public selectedLanguage: ILanguage = {
    language: 'English',
    code: 'en',
    icon: 'us',
  };

  constructor() {
    const document = this.document;

    this.notification$.subscribe(notification => {
      this.unreadNotificationCount = notification?.filter(item => !item.read_at)?.length;
    });
    this.setting$.subscribe(setting => {
      document.body.classList.add(setting?.general?.mode!);
    });
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  clickHeaderOnMobile() {
    this.navServices.search = true;
  }
}
