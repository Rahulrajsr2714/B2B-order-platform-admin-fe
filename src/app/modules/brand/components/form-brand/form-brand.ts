import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Select2Module } from 'ng-select2-component';
import { of, Subject, switchMap, takeUntil } from 'rxjs';

import { B2BImageUpload } from 'src/app/shared/components/ui/b2b-image-upload/b2b-image-upload';

import { Button } from '../../../../shared/components/ui/button/button';
import { FormFields } from '../../../../shared/components/ui/form-fields/form-fields';
import * as data from '../../../../shared/data/country-code';
import { IAttachment } from '../../../../shared/interface/attachment.interface';
import { CustomValidators } from '../../../../shared/validator/password-match';
import { BrandService } from '../../service/brand.service';

('rxjs/operators');

@Component({
  selector: 'app-form-brand',
  templateUrl: './form-brand.html',
  styleUrls: ['./form-brand.scss'],
  imports: [
    ReactiveFormsModule,
    FormFields,
    B2BImageUpload,
    Select2Module,
    Button,
    CommonModule,
  ],
})
export class FormBrand {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private brandService = inject(BrandService);

  readonly type = input<string>(undefined);

  private destroy$ = new Subject<void>();

  public form: FormGroup;
  public id: string;
  public codes = data.countryCodes;
  public isBrowser: boolean;

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);

    this.form = this.formBuilder.group({
      logoUrl: new FormControl(''),
      logo: new FormControl('', [Validators.required]),
      brandCode: new FormControl('', [Validators.required]),
      brandName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      isActive: new FormControl(true, [Validators.required]),
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params['id']) return of();
          return this.brandService.getBrand(params['id']);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((brand) => {
        this.id = brand?.id!;
        this.form.patchValue({
          logoUrl: `http://localhost:4566/b2b/${brand.brandLogoKey}`,
          logo: brand.brandLogoKey,
          brandCode: brand.brandCode,
          brandName: brand.brandName,
          description: brand.description,
          isActive: brand.isActive,
        });
      });
  }

  selectBrandLogo(data: any) {
    console.warn(data);
    if (!Array.isArray(data)) {
      this.form.controls['logoUrl'].setValue(undefined);
      this.form.controls['logo'].setValue(data ? data.file : '');
    }
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.type() === 'edit' && this.id) {
        this.brandService.update(this.id, this.form.value).subscribe({
          complete: () => {
            void this.router.navigateByUrl('/admin/brand');
          },
        });
      } else {
        this.brandService.create(this.form.value).subscribe({
          complete: () => {
            void this.router.navigateByUrl('/admin/brand');
          },
        });
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
