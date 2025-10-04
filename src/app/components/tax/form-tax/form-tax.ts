import { Component, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Subject, of } from 'rxjs';
import { mergeMap, switchMap, takeUntil } from 'rxjs/operators';

import { CreateTaxAction, EditTaxAction, UpdateTaxAction } from '../../../shared/action/tax.action';
import { Button } from '../../../shared/components/ui/button/button';
import { FormFields } from '../../../shared/components/ui/form-fields/form-fields';
import { TaxState } from '../../../shared/state/tax.state';

@Component({
  selector: 'app-form-tax',
  templateUrl: './form-tax.html',
  styleUrls: ['./form-tax.scss'],
  imports: [ReactiveFormsModule, FormFields, Button, TranslateModule],
})
export class FormTax {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  readonly type = input<string>(undefined);

  public id: number;
  public form: FormGroup;

  private destroy$ = new Subject<void>();

  constructor() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      rate: new FormControl('', [Validators.required]),
      status: new FormControl(1),
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
          if (!params['id']) return of();
          return this.store
            .dispatch(new EditTaxAction(params['id']))
            .pipe(mergeMap(() => this.store.select(TaxState.selectedTax)));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(tax => {
        this.id = tax?.id!;
        this.form.patchValue({
          name: tax?.name,
          rate: tax?.rate,
          status: tax?.status,
        });
      });
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateTaxAction(this.form.value);

    if (this.type() == 'edit' && this.id) {
      action = new UpdateTaxAction(this.form.value, this.id);
    }

    if (this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => {
          void this.router.navigateByUrl('/tax');
        },
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
