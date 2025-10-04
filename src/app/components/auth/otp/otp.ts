import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';

import { VerifyEmailOtpAction } from '../../../shared/action/auth.action';
import { Alert } from '../../../shared/components/ui/alert/alert';
import { Button } from '../../../shared/components/ui/button/button';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.html',
  styleUrls: ['./otp.scss'],
  imports: [Alert, ReactiveFormsModule, Button, TranslateModule],
})
export class Otp {
  router = inject(Router);
  store = inject(Store);
  formBuilder = inject(FormBuilder);

  public form: FormGroup;
  public email: string;
  public loading: boolean;

  constructor() {
    this.email = this.store.selectSnapshot(state => state.auth.email);
    if (!this.email) void this.router.navigateByUrl('/auth/login');
    this.form = this.formBuilder.group({
      otp: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store
        .dispatch(
          new VerifyEmailOtpAction({
            email: this.email,
            token: this.form.value.otp,
          }),
        )
        .subscribe({
          complete: () => {
            void this.router.navigateByUrl('/auth/update-password');
          },
        });
    }
  }
}
