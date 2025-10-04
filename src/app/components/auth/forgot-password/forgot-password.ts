import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';

import { ForgotPassWordAction } from '../../../shared/action/auth.action';
import { Alert } from '../../../shared/components/ui/alert/alert';
import { Button } from '../../../shared/components/ui/button/button';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  imports: [Alert, ReactiveFormsModule, Button, TranslateModule],
})
export class ForgotPassword {
  private store = inject(Store);
  router = inject(Router);
  formBuilder = inject(FormBuilder);

  public form: FormGroup;

  constructor() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(new ForgotPassWordAction(this.form.value)).subscribe({
        complete: () => {
          void this.router.navigateByUrl('/auth/otp');
        },
      });
    }
  }
}
