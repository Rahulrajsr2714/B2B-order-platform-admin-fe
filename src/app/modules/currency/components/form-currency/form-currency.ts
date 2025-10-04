import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import {
  Select2Data,
  Select2UpdateEvent,
  Select2Module,
} from 'ng-select2-component';
import { Subject, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Button } from '../../../../shared/components/ui/button/button';
import { FormFields } from '../../../../shared/components/ui/form-fields/form-fields';
import * as data from '../../../../shared/data/currency';
import { CurrencyService } from '../../service/currency.service';

@Component({
  selector: 'app-form-currency',
  templateUrl: './form-currency.html',
  styleUrls: ['./form-currency.scss'],
  imports: [
    ReactiveFormsModule,
    FormFields,
    Select2Module,
    Button,
    TranslateModule,
  ],
})
export class FormCurrency {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private currencyService = inject(CurrencyService);

  readonly type = input<string>(undefined);

  public form: FormGroup;
  public id: string;
  public isBrowser: boolean;

  public symbolPosition: Select2Data = [
    {
      value: 'BEFORE',
      label: 'Before Price',
    },
    {
      value: 'AFTER',
      label: 'After Price',
    },
  ];

  private destroy$ = new Subject<void>();

  public currency = data.currency;
  public currency_dropdown: Select2Data = [];

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);

    this.form = this.formBuilder.group({
      currencyCode: new FormControl('', [Validators.required]),
      currencyName: new FormControl('', [Validators.required]),
      currencySymbol: new FormControl('', [Validators.required]),
      exchangeRate: new FormControl('', [Validators.required]),
      currencySymbolPosition: new FormControl('', [Validators.required]),
      isBaseCurrency: new FormControl(true),
      isActive: new FormControl(false),
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params['id']) return of();
          return this.currencyService.getCurrency(params['id']);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((currency) => {
        this.id = currency?.id!;
        this.form.patchValue({
          currencyCode: currency.currencyCode,
          currencyName: currency.currencyName,
          currencySymbol: currency.currencySymbol,
          exchangeRate: currency.exchangeRate,
          currencySymbolPosition: currency.currencySymbolPosition,
          isBaseCurrency: currency.isBaseCurrency,
          isActive: currency.isActive,
        });
      });
    /* if (this.selectedCurrency().currencyCode) {
      this.form.patchValue({
        currencyCode: this.selectedCurrency().currencyCode,
        currencyName: this.selectedCurrency().currencyName,
        currencySymbol: this.selectedCurrency().currencySymbol,
        exchangeRate: this.selectedCurrency().exchangeRate,
        currencySymbolPosition: this.selectedCurrency().currencySymbolPosition,
        isBaseCurrency: this.selectedCurrency().isBaseCurrency,
        isActive: this.selectedCurrency().isActive,
      });
    } */

    this.currency.forEach((data) => {
      this.currency_dropdown.push({
        label: data.currency_code,
        value: data.currency_code,
      });
    });
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.type() === 'edit' && this.id) {
        this.currencyService.update(this.id, this.form.value).subscribe({
          complete: () => {
            void this.router.navigateByUrl('/admin/currency');
          },
        });
      } else {
        this.currencyService.create(this.form.value).subscribe({
          complete: () => {
            void this.router.navigateByUrl('/admin/currency');
          },
        });
      }
    }
  }

  changeCurrency(data: Select2UpdateEvent) {
    let selected_currency = this.currency?.find((curr) => {
      return curr.currency_code === data.value;
    });
    this.form.patchValue({
      symbol: selected_currency?.currency_symbol,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
