import { CommonModule, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GetMenuAction } from '../../action/menu.action';
import { HasPermissionDirective } from '../../directive/has-permission.directive';
import { IAccountUser } from '../../interface/account.interface';
import { IMenu, IMenuModel } from '../../interface/menu.interface';
import { IPermission } from '../../interface/role.interface';
import { IValues } from '../../interface/setting.interface';
import { NavService } from '../../services/nav.service';
import { AccountState } from '../../state/account.state';
import { MenuState } from '../../state/menu.state';
import { SettingState } from '../../state/setting.state';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  imports: [RouterModule, NgTemplateOutlet, CommonModule, HasPermissionDirective, TranslateModule],
})
export class Sidebar {
  navServices = inject(NavService);
  private platformId = inject<Object>(PLATFORM_ID);
  private router = inject(Router);
  private store = inject(Store);

  readonly class = input<string>(undefined);

  user$: Observable<IAccountUser> = inject(Store).select(AccountState.user);
  permissions$: Observable<IPermission[]> = inject(Store).select(AccountState.permissions);
  setting$: Observable<IValues | null> = inject(Store).select(SettingState.setting);
  menu$: Observable<IMenuModel> = inject(Store).select(MenuState.menu);

  public item: IMenu;
  public menuItems: IMenu[] = [];
  public permissions: string[] = [];
  public sidebarTitleKey: string = 'sidebar';

  constructor() {
    this.store.dispatch(new GetMenuAction());
    this.menu$.subscribe(menuItems => {
      this.menuItems = menuItems?.data;
      void this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.menuItems?.forEach((menu: IMenu) => {
            menu.active = false;
            this.activeMenuRecursive(
              menu,
              event.url.split('?')[0].toString().split('/')[1].toString(),
            );
          });
        }
      });
    });
  }

  hasMainLevelMenuPermission(acl_permission?: string[]) {
    let status = true;
    if (acl_permission?.length) {
      this.permissions$.subscribe(permission => {
        this.permissions = permission?.map((value: IPermission) => value?.name);
        if (!acl_permission?.some(action => this.permissions?.includes(action))) {
          status = false;
        }
      });
    }
    return status;
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  onItemSelected(item: IMenu, onRoute: boolean = false) {
    this.menuItems.forEach((menu: IMenu) => {
      this.deActiveAllMenu(menu, item);
    });
    if (!onRoute) item.active = !item.active;
  }

  activeMenuRecursive(menu: IMenu, url: string, item?: IMenu) {
    if (menu && menu.path && menu.path == (url.charAt(0) !== '/' ? '/' + url : url)) {
      if (item) {
        item.active = true;
        this.onItemSelected(item, true);
      }
      menu.active = true;
    }
    if (menu?.children?.length) {
      menu?.children.forEach((child: IMenu) => {
        this.activeMenuRecursive(child, url.charAt(0) !== '/' ? '/' + url : url.toString(), menu);
      });
    }
  }

  deActiveAllMenu(menu: IMenu, item: IMenu) {
    if (menu && menu.active && menu.id != item.id) {
      menu.active = false;
    }
    if (menu?.children?.length) {
      menu?.children.forEach((child: IMenu) => {
        this.deActiveAllMenu(child, item);
      });
    }
  }

  closeSidebar() {
    if (isPlatformBrowser(this.platformId)) {
      // For SSR
      if (window.innerWidth < 992) {
        this.navServices.collapseSidebar = false;
      }
    }
  }
}
