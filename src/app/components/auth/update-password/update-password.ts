import { NgClass } from '@angular/common';
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

import { UpdatePasswordActionAction } from '../../../shared/action/auth.action';
import { Alert } from '../../../shared/components/ui/alert/alert';
import { Button } from '../../../shared/components/ui/button/button';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.scss'],
  imports: [Alert, ReactiveFormsModule, NgClass, Button, TranslateModule],
})
export class UpdatePassword {
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);
  router = inject(Router);

  public form: FormGroup;
  public email: string;
  public token: number;
  public show: boolean = false;

  constructor() {
    this.email = this.store.selectSnapshot(state => state.auth.email);
    this.token = this.store.selectSnapshot(state => state.auth.token);
    if (!this.email && !this.token) void this.router.navigateByUrl('/auth/login');
    this.form = this.formBuilder.group({
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  showPassword() {
    this.show = !this.show;
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store
        .dispatch(
          new UpdatePasswordActionAction({
            email: this.email,
            token: Number(this.token),
            password: this.form.value.newPassword,
            password_confirmation: this.form.value.confirmPassword,
          }),
        )
        .subscribe({
          complete: () => {
            void this.router.navigateByUrl('/auth/login');
          },
        });
    }
  }
}
