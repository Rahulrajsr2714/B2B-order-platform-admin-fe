import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Select2Data, Select2Module, Select2UpdateEvent } from 'ng-select2-component';
import { Observable, map } from 'rxjs';

import {
  UpdateUserPasswordAction,
  UpdateUserProfileAction,
  UpdateStoreDetailsAction,
} from '../../shared/action/account.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Button } from '../../shared/components/ui/button/button';
import { FormFields } from '../../shared/components/ui/form-fields/form-fields';
import { ImageUpload } from '../../shared/components/ui/image-upload/image-upload';
import * as data from '../../shared/data/country-code';
import { IAccountUser } from '../../shared/interface/account.interface';
import { IAttachment } from '../../shared/interface/attachment.interface';
import { IStores } from '../../shared/interface/store.interface';
import { AccountState } from '../../shared/state/account.state';
import { CountryState } from '../../shared/state/country.state';
import { StateState } from '../../shared/state/state.state';
import { StoreState } from '../../shared/state/store.state';
import { CustomValidators } from '../../shared/validator/password-match';

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
  imports: [
    PageWrapper,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    ReactiveFormsModule,
    FormFields,
    ImageUpload,
    Select2Module,
    Button,
    NgbNavOutlet,
    CommonModule,
    TranslateModule,
  ],
})
export class Account {
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);

  user$: Observable<IAccountUser> = inject(Store).select(AccountState.user);
  store$: Observable<IStores> = inject(Store).select(
    StoreState.selectedStore,
  ) as Observable<IStores>;
  countries$: Observable<Select2Data> = inject(Store).select(CountryState.countries);
  roleName$: Observable<string> = inject(Store).select(
    AccountState.getRoleName,
  ) as Observable<string>;

  public active = 'profile';
  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  public form: FormGroup;
  public codes = data.countryCodes;
  public states$: Observable<Select2Data>;
  public flicker: boolean = false;
  public isBrowser: boolean;

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);
    this.user$.subscribe(user => {
      this.profileForm = this.formBuilder.group({
        name: new FormControl(user?.name, [Validators.required]),
        email: new FormControl(user?.email, [Validators.required, Validators.email]),
        phone: new FormControl(user?.phone, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
        country_code: new FormControl(user?.country_code, [Validators.required]),
        profile_image_id: new FormControl(user?.profile_image_id),
      });

      this.flicker = true;

      if (user && user.store) {
        this.form = this.formBuilder.group({
          store_name: new FormControl(user.store.store_name, [Validators.required]),
          description: new FormControl(user.store.description, [Validators.required]),
          country_id: new FormControl(user.store?.country_id, [Validators.required]),
          state_id: new FormControl(user?.store?.state_id, [Validators.required]),
          city: new FormControl(user?.store?.city, [Validators.required]),
          address: new FormControl(user?.store?.address, [Validators.required]),
          pincode: new FormControl(user?.store?.pincode, [Validators.required]),
          store_logo_id: new FormControl(user?.store?.store_logo_id),
          hide_vendor_email: new FormControl(user?.store?.hide_vendor_email),
          hide_vendor_phone: new FormControl(user?.store?.hide_vendor_phone),
          facebook: new FormControl(user?.store?.facebook),
          instagram: new FormControl(user?.store?.instagram),
          pinterest: new FormControl(user?.store?.pinterest),
          youtube: new FormControl(user?.store?.youtube),
          twitter: new FormControl(user?.store?.twitter),
        });
      }

      setTimeout(() => (this.flicker = false), 200);
    });

    this.passwordForm = this.formBuilder.group(
      {
        current_password: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        password_confirmation: new FormControl('', [Validators.required]),
      },
      { validator: CustomValidators.MatchValidator('password', 'password_confirmation') },
    );
  }

  countryChange(data: Select2UpdateEvent) {
    if (data && data?.value) {
      this.states$ = this.store
        .select(StateState.states)
        .pipe(map(filterFn => filterFn(+data?.value)));
      this.form.controls['state_id'].setValue('');
    } else {
      this.form.controls['state_id'].setValue('');
    }
  }

  get passwordMatchError() {
    return (
      this.passwordForm?.getError('mismatch') &&
      this.passwordForm?.get('password_confirmation')?.touched
    );
  }

  selectCode(data: Select2UpdateEvent) {
    this.profileForm.controls['country_code'].setValue(data?.value);
  }

  selectedFiles(data: IAttachment) {
    if (!Array.isArray(data)) {
      this.profileForm.controls['profile_image_id'].setValue(data ? data.id : '');
    }
  }

  profileFormSubmit() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      this.store.dispatch(new UpdateUserProfileAction(this.profileForm.value));
    }
  }

  passwordFormSubmit() {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.valid) {
      this.store.dispatch(new UpdateUserPasswordAction(this.passwordForm.value));
      this.passwordForm.reset();
    }
  }

  selectStoreLogo(data: IAttachment) {
    if (!Array.isArray(data)) {
      this.form.controls['store_logo_id'].setValue(data ? data.id : '');
    }
  }

  updateStore() {
    this.store.dispatch(new UpdateStoreDetailsAction(this.form.value));
  }
}
