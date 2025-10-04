import { Component, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';

import {
  CreateRoleAction,
  EditRoleAction,
  UpdateRoleAction,
} from '../../../shared/action/role.action';
import { Button } from '../../../shared/components/ui/button/button';
import { FormFields } from '../../../shared/components/ui/form-fields/form-fields';
import { RoleState } from '../../../shared/state/role.state';
import { Permissions } from '../permissions/permissions';

@Component({
  selector: 'app-form-role',
  templateUrl: './form-role.html',
  styleUrls: ['./form-role.scss'],
  imports: [ReactiveFormsModule, FormFields, Permissions, Button, TranslateModule],
})
export class FormRole {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  readonly type = input<String>(undefined);

  public form: FormGroup;
  public permissions: number[] = [];
  public id: number;

  private destroy$ = new Subject<void>();

  constructor() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      permissions: new FormControl('', [Validators.required]),
    });
  }

  get permissionControl(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
          if (!params['id']) return of();
          return this.store
            .dispatch(new EditRoleAction(params['id']))
            .pipe(mergeMap(() => this.store.select(RoleState.selectedRole)));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(role => {
        this.id = role?.id!;
        let permissions = role?.permissions!.map(permission => permission?.id);
        this.permissions = permissions!;
        this.form.patchValue({
          name: role?.name,
          permissions: permissions,
        });
      });
  }

  setPermissions(permissions: number[]) {
    if (Array.isArray(permissions)) {
      this.form.controls['permissions'].setValue(permissions);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateRoleAction(this.form.value);

    if (this.type() == 'edit' && this.id) {
      action = new UpdateRoleAction(this.form.value, this.id);
    }

    if (this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => {
          void this.router.navigateByUrl('/role');
        },
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
