import { Component, inject, input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { of, Subject, switchMap, takeUntil } from 'rxjs';

import { PageWrapper } from 'src/app/shared/components/page-wrapper/page-wrapper';
import { AdvancedDropdown } from 'src/app/shared/components/ui/advanced-dropdown/advanced-dropdown';
import { B2BImageUpload } from 'src/app/shared/components/ui/b2b-image-upload/b2b-image-upload';
import { Button } from 'src/app/shared/components/ui/button/button';
import { FormFields } from 'src/app/shared/components/ui/form-fields/form-fields';

import { ICategory } from '../../models/category.interface';
import { CategoryService } from '../../service/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-category',
  templateUrl: './form-category.html',
  styleUrls: ['./form-category.scss'],
  imports: [
    PageWrapper,
    ReactiveFormsModule,
    FormFields,
    AdvancedDropdown,
    B2BImageUpload,
    Button,
    TranslateModule,
  ],
})
export class FormCategory {
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  readonly type = input<string>(undefined);
  readonly categories = input<ICategory[]>(undefined);

  public form: FormGroup;
  public category: ICategory;
  public id: string;

  private destroy$ = new Subject<void>();

  constructor() {
    this.form = this.formBuilder.group({
      categoryCode: new FormControl('', [Validators.required]),
      categoryName: new FormControl(),
      parentCategory: new FormControl(),
      description: new FormControl('', []),
      isActive: new FormControl(true),
      pictureUrl: new FormControl(''),
      picture: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params['id']) return of();
          return this.categoryService.getCategoryById(params['id']);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((category: ICategory) => {
        this.id = category?.id!;
        this.category = category;
        this.form.patchValue({
          categoryCode: category.categoryCode,
          categoryName: category.categoryName,
          parentCategory: category.parentCategoryId,
          description: category.description,
          isActive: category.isActive,
          pictureUrl: category.pictureUrl,
          picture: category.pictureUrl,
        });
      });
  }

  selectItem(data: number[]) {
    if (Array.isArray(data) && data.length) {
      this.form.controls['parentCategory'].setValue(data[0]);
    } else {
      this.form.controls['parentCategory'].setValue('');
    }
  }

  selectCategoryPicture(data: any) {
    if (!Array.isArray(data)) {
      this.form.controls['picture'].setValue(data ? data.file : '');
    }
  }

  // selectCategoryIcon(data: a) {
  //   if (!Array.isArray(data)) {
  //     this.form.controls['category_icon_id'].setValue(data ? data.id : '');
  //   }
  // }

  submit() {
    this.form.markAllAsTouched();
    console.log(this.form.value);
    // return;
    if (this.form.valid) {
      if (this.type() === 'edit' && this.id) {
        this.categoryService.update(this.id, this.form.value).subscribe({
          complete: () => {
            this.form.reset();
            this.form.patchValue({
              categoryCode: '',
              categoryName: '',
              parentCategory: '',
              description: '',
              isActive: true,
              pictureUrl: '',
              picture: undefined,
            });
            void this.router.navigateByUrl('/admin/category');
          },
        });
      } else {
        this.categoryService.create(this.form.value).subscribe({
          complete: () => {
            this.form.reset();
            this.form.patchValue({
              categoryCode: '',
              categoryName: '',
              parentCategory: '',
              description: '',
              isActive: true,
              pictureUrl: '',
              picture: undefined,
            });
            void this.router.navigateByUrl('/admin/category');
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
