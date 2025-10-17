import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  input,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  NgbDate,
  NgbDateStruct,
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Select2Module, Select2Option } from 'ng-select2-component';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { of, Subject, switchMap, takeUntil } from 'rxjs';

import {
  IBrand,
  IBrandModel,
} from 'src/app/modules/brand/models/brand.interface';
import { BrandService } from 'src/app/modules/brand/service/brand.service';
import { ICategoryModel } from 'src/app/modules/categories/models/category.interface';
import { CategoryService } from 'src/app/modules/categories/service/category.service';
import {
  ICurrencyModel,
  ICurrency,
} from 'src/app/modules/currency/models/currency.interface';
import { CurrencyService } from 'src/app/modules/currency/service/currency.service';
import { B2BImageUpload } from 'src/app/shared/components/ui/b2b-image-upload/b2b-image-upload';

import { AdvancedDropdown } from '../../../../shared/components/ui/advanced-dropdown/advanced-dropdown';
import { Button } from '../../../../shared/components/ui/button/button';
import { FormFields } from '../../../../shared/components/ui/form-fields/form-fields';
import { IB2bProduct, ICategory } from '../../models/b2b-product.interface';
import { B2bProductService } from '../../service/b2b-product.service';

function convertToNgbDate(date: NgbDateStruct): NgbDate {
  return new NgbDate(date.year, date.month, date.day);
}

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.html',
  styleUrls: ['./form-product.scss'],
  imports: [
    ReactiveFormsModule,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    FormFields,
    NgxEditorModule,
    Select2Module,
    Button,
    B2BImageUpload,
    AdvancedDropdown,
    NgbNavOutlet,
    CommonModule,
    TranslateModule,
  ],
})
export class FormProduct {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private brandService = inject(BrandService);
  private categoryService = inject(CategoryService);
  private currencyService = inject(CurrencyService);
  private b2bProductService = inject(B2bProductService);

  readonly type = input<string>(undefined);

  readonly nav = viewChild<NgbNav>('nav');

  public active = 'basic';
  public tabError: string | null;
  public form: FormGroup;
  public id: string;
  public selectedCategories: Number[] = [];
  private destroy$ = new Subject<void>();
  public isBrowser: boolean;

  private search = new Subject<string>();
  public editor: Editor;
  public html = '';
  brands: IBrand[] = [];
  select2Brands: Select2Option[] = [];

  currencies: ICurrency[] = [];
  select2Currencies: Select2Option[] = [];

  categories: ICategory[] = [];

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);

    this.form = this.formBuilder.group({
      // Define all form controls without default values
      productCode: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      productName: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      commercialName: new FormControl('', [Validators.maxLength(255)]),
      legalName: new FormControl('', [Validators.maxLength(255)]),
      shortDescription: new FormControl(''),
      description: new FormControl(''),
      summary: new FormControl(''),
      customSlug: new FormControl('', [Validators.maxLength(500)]),
      metaTitle: new FormControl('', [Validators.maxLength(255)]),
      metaDescription: new FormControl(''),
      brandId: new FormControl(null),
      productType: new FormControl('', [Validators.maxLength(50)]),

      eanCu: new FormControl(''),
      barcodeCu: new FormControl(''),
      netWeightCu: new FormControl(null),
      grossWeightCu: new FormControl(null),
      lengthCu: new FormControl(null),
      widthCu: new FormControl(null),
      heightCu: new FormControl(null),

      eanSu: new FormControl(''),
      barcodeSu: new FormControl(''),
      piecesPerSu: new FormControl(null, [Validators.min(1)]),
      grossWeightSu: new FormControl(null),
      lengthSu: new FormControl(null),
      widthSu: new FormControl(null),
      heightSu: new FormControl(null),

      layersPerPallet: new FormControl(null),
      salesUnitsPerPallet: new FormControl(null),

      countryOfOriginCode: new FormControl('', [Validators.maxLength(3)]),
      countryOfOriginName: new FormControl('', [Validators.maxLength(100)]),

      ingredients: new FormControl(''),
      energyKj: new FormControl(null),
      energyKcal: new FormControl(null),
      fat: new FormControl(null),
      saturatedFat: new FormControl(null),
      carbohydrates: new FormControl(null),
      sugars: new FormControl(null),
      proteins: new FormControl(null),
      salt: new FormControl(null),

      isHalal: new FormControl(false),
      isKosher: new FormControl(false),
      isVegetarian: new FormControl(false),
      isVegan: new FormControl(false),
      isOrganic: new FormControl(false),
      isBiological: new FormControl(false),
      isNatural: new FormControl(false),
      isGlutenFree: new FormControl(false),
      isAlcoholFree: new FormControl(false),
      isGmoFree: new FormControl(false),
      hasArtificialAdditives: new FormControl(false),

      spicinessLevel: new FormControl(''),
      spicinessDescription: new FormControl(''),

      isCoolFresh: new FormControl(false),
      isFrozen: new FormControl(false),
      bestBeforeDate: new FormControl(''),
      expiryDate: new FormControl(''),

      stockLevel: new FormControl(null, [Validators.min(0)]),
      stockStatus: new FormControl(''),
      reorderLevel: new FormControl(null),
      reorderQuantity: new FormControl(null),

      isActive: new FormControl(false),
      isPurchasable: new FormControl(false),
      isTrending: new FormControl(false),
      isOnOffer: new FormControl(false),
      promotionLabel: new FormControl(''),

      categoryIds: new FormControl([]),

      // Currency and Pricing
      currencyId: new FormControl('', [Validators.required]),

      // Base Prices - Per Piece
      purchasePricePce: new FormControl(null, [
        Validators.required,
        Validators.min(0),
      ]),
      mrpPce: new FormControl(null, [Validators.required, Validators.min(0)]),
      sellingPricePce: new FormControl(null, [
        Validators.required,
        Validators.min(0),
      ]),

      // Base Prices - Per Case
      purchasePriceCs: new FormControl(null, [
        Validators.required,
        Validators.min(0),
      ]),
      mrpCs: new FormControl(null, [Validators.required, Validators.min(0)]),
      sellingPriceCs: new FormControl(null, [
        Validators.required,
        Validators.min(0),
      ]),

      images: new FormControl([]),
      imageUrls: new FormControl([]),

      variants: this.formBuilder.array([], []),
      variations: this.formBuilder.array([], []),
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params['id']) return of();
          return this.b2bProductService.getProduct(params['id']);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((product: IB2bProduct) => {
        this.id = product?.id!;
        if (product) {
          this.form.patchValue({
            ...product,
            categoryIds: product.categories?.map((cat) => cat.id) || [],
            imageUrls: product.images || [],
            // images: product.images || [],
            brandId: product.brand?.id || null,
            // currencyId: product.currency?.id || '',
          });
        }
      });
    if (this.isBrowser) {
      this.editor = new Editor();
    }
    this.fetchAllBrands();
    this.fetchAllCategories();
    this.fetchAllCurrencies();

    // Uncomment the following block to patch default values for easier testing

    // this.form.patchValue({
    //   productCode: 'TESTCODE123',
    //   productName: 'Test Product',
    //   commercialName: 'Test Commercial Name',
    //   legalName: 'Test Legal Name',
    //   shortDescription: 'Short description for testing',
    //   description: 'Detailed description for testing',
    //   summary: 'Summary for testing',
    //   customSlug: 'test-product-slug',
    //   metaTitle: 'Test Meta Title',
    //   metaDescription: 'Test meta description',
    //   brandId: 'd32c5318-52b2-42dd-9995-658be9e1ba48',
    //   productType: 'TypeA',

    //   eanCu: '1234567890123',
    //   barcodeCu: '9876543210987',
    //   netWeightCu: 100,
    //   grossWeightCu: 120,
    //   lengthCu: 10,
    //   widthCu: 5,
    //   heightCu: 3,

    //   eanSu: '1234567890124',
    //   barcodeSu: '9876543210988',
    //   piecesPerSu: 6,
    //   grossWeightSu: 720,
    //   lengthSu: 20,
    //   widthSu: 10,
    //   heightSu: 6,

    //   layersPerPallet: 4,
    //   salesUnitsPerPallet: 24,

    //   countryOfOriginCode: 'IN',
    //   countryOfOriginName: 'India',

    //   ingredients: 'Sugar, Salt, Water',
    //   energyKj: 500,
    //   energyKcal: 120,
    //   fat: 2,
    //   saturatedFat: 0.5,
    //   carbohydrates: 30,
    //   sugars: 25,
    //   proteins: 3,
    //   salt: 1,

    //   isHalal: true,
    //   isKosher: false,
    //   isVegetarian: true,
    //   isVegan: false,
    //   isOrganic: true,
    //   isBiological: false,
    //   isNatural: true,
    //   isGlutenFree: true,
    //   isAlcoholFree: true,
    //   isGmoFree: true,
    //   hasArtificialAdditives: false,

    //   spicinessLevel: 'Medium',
    //   spicinessDescription: 'Mildly spicy',

    //   isCoolFresh: true,
    //   isFrozen: false,
    //   bestBeforeDate: '2024-12-31',
    //   expiryDate: '2025-06-30',

    //   stockLevel: 100,
    //   stockStatus: 'inStock',
    //   reorderLevel: 20,
    //   reorderQuantity: 50,

    //   isActive: true,
    //   isPurchasable: true,
    //   isTrending: true,
    //   isOnOffer: true,
    //   promotionLabel: 'Special Offer',

    //   categoryIds: [
    //     'f88f15be-54bc-4525-995d-62b688b63900',
    //     '599ab13a-723f-4d86-95a6-24ba6d024939',
    //   ],

    //   // Currency and Pricing
    //   currencyId: 'b7b8a9e2-8c3c-4c1d-9e2b-8c3c4c1d9e2b',

    //   // Base Prices - Per Piece
    //   purchasePricePce: 100.0,
    //   mrpPce: 120.0,
    //   sellingPricePce: 110.0,

    //   // Base Prices - Per Case
    //   purchasePriceCs: 600.0,
    //   mrpCs: 720.0,
    //   sellingPriceCs: 660.0,
    // });
  }

  fetchAllBrands() {
    this.brandService.getBrands().subscribe({
      next: (resp: IBrandModel) => {
        this.brands = resp.data;

        this.select2Brands = this.brands.map((brand) => ({
          value: brand.id,
          label: brand.brandName,
        }));
      },
    });
  }

  fetchAllCategories() {
    this.categoryService.getAllCategory().subscribe({
      next: (resp: ICategoryModel) => {
        this.categories = resp.data;
      },
    });
  }

  fetchAllCurrencies() {
    this.currencyService.getCurrencies().subscribe({
      next: (resp: ICurrencyModel) => {
        this.currencies = resp.data;
        this.select2Currencies = this.currencies.map((currency) => ({
          value: currency.id,
          label: `${currency.currencyName} (${currency.currencyCode}) -- [${currency.isBaseCurrency ? 'BASE' : ''}]`,
        }));
      },
    });
  }

  selectCategoryItem(data: string[]) {
    if (Array.isArray(data)) {
      this.form.controls['categoryIds'].setValue(data);
    }
  }

  selectImages(data: any) {
    if (Array.isArray(data)) {
      let files = Array.isArray(data) ? data?.map((image) => image.file) : [];

      this.form.controls['imageUrls'].setValue(data);
      this.form.controls['images'].setValue(files.length ? files : []);
    }
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.type() === 'edit' && this.id) {
        this.b2bProductService.update(this.id, this.form.value).subscribe({
          complete: () => {
            void this.router.navigateByUrl('/admin/product');
          },
        });
      } else {
        this.b2bProductService.create(this.form.value).subscribe({
          complete: () => {
            void this.router.navigateByUrl('/admin/product');
          },
        });
      }
    }
  }
}
