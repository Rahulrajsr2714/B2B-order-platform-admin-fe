import { CurrencyPipe } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { GlobalErrorHandlerInterceptor } from './core/interceptors/global-error-handler.interceptor';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { AccountState } from './shared/state/account.state';
import { AttachmentState } from './shared/state/attachment.state';
import { AttributeState } from './shared/state/attribute.state';
import { AuthState } from './shared/state/auth.state';
import { BlogState } from './shared/state/blog.state';
import { CartState } from './shared/state/cart.state';
import { CategoryState } from './shared/state/category.state';
import { CommissionState } from './shared/state/commission.state';
import { CountryState } from './shared/state/country.state';
import { CouponState } from './shared/state/coupon.state';
import { CurrencyState } from './shared/state/currency.state';
import { DashboardState } from './shared/state/dashboard.state';
import { FaqState } from './shared/state/faq.state';
import { LoaderState } from './shared/state/loader.state';
import { MenuState } from './shared/state/menu.state';
import { NotificationState } from './shared/state/notification.state';
import { OrderStatusState } from './shared/state/order-status.state';
import { OrderState } from './shared/state/order.state';
import { PageState } from './shared/state/page.state';
import { PaymentDetailsState } from './shared/state/payment-details.state';
import { PointState } from './shared/state/point.state';
import { ProductState } from './shared/state/product.state';
import { QuestionAnswersState } from './shared/state/questions-answers.state';
import { RefundState } from './shared/state/refund.state';
import { ReviewState } from './shared/state/review.state';
import { RoleState } from './shared/state/role.state';
import { SettingState } from './shared/state/setting.state';
import { ShippingState } from './shared/state/shipping.state';
import { StateState } from './shared/state/state.state';
import { StoreState } from './shared/state/store.state';
import { TagState } from './shared/state/tag.state';
import { TaxState } from './shared/state/tax.state';
import { ThemeOptionState } from './shared/state/theme-option.state';
import { ThemeState } from './shared/state/theme.state';
import { UserState } from './shared/state/user.state';
import { VendorWalletState } from './shared/state/vendor-wallet.state';
import { WalletState } from './shared/state/wallet.state';
import { WithdrawalState } from './shared/state/withdrawal.state';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    CurrencyPipe,
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      NgxsModule.forRoot([
        LoaderState,
        MenuState,
        NotificationState,
        DashboardState,
        AccountState,
        CountryState,
        StateState,
        SettingState,
        AttachmentState,
      ]),
      NgxsModule.forFeature([
        AttributeState,
        AuthState,
        BlogState,
        CategoryState,
        CommissionState,
        CouponState,
        ProductState,
        CurrencyState,
        FaqState,
        OrderState,
        CartState,
        OrderStatusState,
        TagState,
        UserState,
        StateState,
        PointState,
        ReviewState,
        WalletState,
        SettingState,
        ShippingState,
        WithdrawalState,
        VendorWalletState,
        RoleState,
        PageState,
        ThemeOptionState,
        RefundState,
        TaxState,
        ThemeState,
        QuestionAnswersState,
        PaymentDetailsState,
        StoreState,
      ]),
      NgxsStoragePluginModule.forRoot({
        keys: ['auth', 'dashboard', 'notification', 'account', 'country', 'state', 'setting'],
      }),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideToastr({
      positionClass: 'toast-top-center',
    }),
  ],
};
