import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';

import { LoginAction } from '../../../shared/action/auth.action';
import { Alert } from '../../../shared/components/ui/alert/alert';
import { Button } from '../../../shared/components/ui/button/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [Alert, ReactiveFormsModule, RouterModule, TranslateModule, Button],
})
export class Login {
  private store = inject(Store);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  public form: FormGroup;

  constructor() {
    this.form = this.formBuilder.group({
      email: new FormControl('admin@example.com', [Validators.required, Validators.email]),
      password: new FormControl('123456789', [Validators.required]),
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(new LoginAction(this.form.value)).subscribe({
        complete: () => {
          void this.router.navigateByUrl('/dashboard');
        },
      });
    }
  }
}
