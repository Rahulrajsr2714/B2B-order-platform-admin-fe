import { Component, DOCUMENT, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

import { NgbNavConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateService } from '@ngx-translate/core';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LogoutAction } from './shared/action/auth.action';
import { GetCountriesAction } from './shared/action/country.action';
import { GetSettingOptionAction } from './shared/action/setting.action';
import { GetStatesAction } from './shared/action/state.action';
import { IValues } from './shared/interface/setting.interface';
import { SettingState } from './shared/state/setting.state';

@Component({
  selector: 'app-root',
  imports: [RouterModule, LoadingBarRouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private actions = inject(Actions);
  private router = inject(Router);
  private titleService = inject(Title);
  private store = inject(Store);
  private translate = inject(TranslateService);

  setting$: Observable<IValues> = inject(Store).select(SettingState.setting);

  public favIcon: HTMLLinkElement | null;

  constructor() {
    const config = inject(NgbNavConfig);
    const document = inject<Document>(DOCUMENT);

    this.translate.use('en');
    this.store.dispatch(new GetSettingOptionAction());
    this.store.dispatch(new GetCountriesAction());
    this.store.dispatch(new GetStatesAction());
    this.setting$.subscribe((setting) => {
      // Set Direction
      if (setting?.general?.admin_site_language_direction === 'rtl') {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
      } else {
        document.getElementsByTagName('html')[0].removeAttribute('dir');
        document.body.classList.remove('rtl');
      }

      // Set Favicon
      this.favIcon = document.querySelector('#appIcon');
      this.favIcon!.href = <string>(
        setting?.general?.favicon_image?.original_url
      );

      // Set site title
      this.titleService.setTitle(
        setting?.general?.site_title && setting?.general?.site_tagline
          ? `${setting?.general?.site_title} | ${setting?.general?.site_tagline}`
          : 'FastKart Marketplace: Where Vendors Shine Together',
      );
    });

    // customize default values of navs used by this component tree
    config.destroyOnHide = false;
    config.roles = false;

    this.actions.pipe(ofActionDispatched(LogoutAction)).subscribe(() => {
      void this.router.navigate(['/auth/login']);
    });
  }
}
