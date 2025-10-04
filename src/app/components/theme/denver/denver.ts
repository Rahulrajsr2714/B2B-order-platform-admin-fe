import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, DOCUMENT, inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbAccordionToggle,
  NgbCollapse,
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Select2, Select2Data, Select2Module, Select2SearchEvent } from 'ng-select2-component';
import { debounceTime, forkJoin, Observable, Subject } from 'rxjs';

import { GetCategoriesAction } from '../../../shared/action/category.action';
import { GetProductsAction } from '../../../shared/action/product.action';
import { GetHomePageAction, UpdateHomePageAction } from '../../../shared/action/theme.action';
import { PageWrapper } from '../../../shared/components/page-wrapper/page-wrapper';
import { Button } from '../../../shared/components/ui/button/button';
import { FormFields } from '../../../shared/components/ui/form-fields/form-fields';
import { ImageUpload } from '../../../shared/components/ui/image-upload/image-upload';
import { Link } from '../../../shared/components/ui/link/link';
import * as data from '../../../shared/data/home-page';
import { HasPermissionDirective } from '../../../shared/directive/has-permission.directive';
import { Params } from '../../../shared/interface/core.interface';
import { IDenver, IDenverContent } from '../../../shared/interface/theme.interface';
import { CategoryState } from '../../../shared/state/category.state';
import { ProductState } from '../../../shared/state/product.state';
import { ThemeState } from '../../../shared/state/theme.state';

@Component({
  selector: 'app-denver',
  templateUrl: './denver.html',
  imports: [
    PageWrapper,
    ReactiveFormsModule,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    FormFields,
    ImageUpload,
    Link,
    Select2Module,
    NgbNavOutlet,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionToggle,
    NgbAccordionButton,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    HasPermissionDirective,
    Button,
    CommonModule,
    TranslateModule,
  ],
})
export class Denver {
  private store = inject(Store);
  formBuilder = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private document = inject<Document>(DOCUMENT);

  product$: Observable<Select2Data> = inject(Store).select(ProductState.products);
  home_page$: Observable<IDenver> = inject(Store).select(ThemeState.homePage<IDenverContent>);
  categories$: Observable<Select2Data> = inject(Store).select(CategoryState.categories);

  public page_data: IDenver;
  public active = 'home_banner';
  public form: FormGroup;
  public banner = 1;
  public slider_product = 1;
  public sort = data.sort;
  public product_list_type = data.product_list_type;

  private search = new Subject<string>();
  private destroy$ = new Subject<void>();
  public isBrowser: boolean;

  public filter = {
    status: 1,
    search: '',
    paginate: 15,
    ids: '',
    with_union_products: 0,
    is_approved: 1,
  };

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);
    this.form = new FormGroup({
      content: new FormGroup({
        home_banner: new FormGroup({
          status: new FormControl(false),
          main_banner: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
        }),
        categories_icon_list: new FormGroup({
          status: new FormControl(false),
          category_ids: new FormControl([]),
          image_url: new FormControl(''),
        }),
        products_list_1: new FormGroup({
          title: new FormControl(''),
          product_ids: new FormControl([]),
          status: new FormControl(''),
        }),
        two_column_banners: new FormGroup({
          status: new FormControl(false),
          banner_1: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
          banner_2: new FormGroup({
            image_url: new FormControl(''),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
        }),
        slider_product_with_banner: new FormGroup({
          left_side_banners: new FormGroup({
            status: new FormControl(false),
            banner_1: new FormGroup({
              image_url: new FormControl(''),
              redirect_link: new FormGroup({
                link: new FormControl(''),
                link_type: new FormControl(''),
                product_ids: new FormControl(''),
              }),
            }),
          }),
          slider_products: new FormGroup({
            status: new FormControl(false),
            product_slider_1: new FormGroup({
              title: new FormControl(''),
              product_ids: new FormControl([]),
              status: new FormControl(false),
            }),
            product_slider_2: new FormGroup({
              title: new FormControl(''),
              product_ids: new FormControl([]),
              status: new FormControl(false),
            }),
            product_slider_3: new FormGroup({
              title: new FormControl(''),
              product_ids: new FormControl([]),
              status: new FormControl(false),
            }),
          }),
        }),
        coupon_banner: new FormGroup({
          image_url: new FormControl(''),
          status: new FormControl(false),
          redirect_link: new FormGroup({
            link: new FormControl(''),
            link_type: new FormControl(''),
            product_ids: new FormControl(''),
          }),
        }),
        products_list_2: new FormGroup({
          title: new FormControl(''),
          product_ids: new FormControl([]),
          status: new FormControl(false),
        }),
        products_list_3: new FormGroup({
          title: new FormControl(''),
          product_ids: new FormControl([]),
          status: new FormControl(false),
        }),
        news_letter: new FormGroup({
          title: new FormControl(''),
          status: new FormControl(false),
          image_url: new FormControl(''),
          sub_title: new FormControl(''),
        }),
        products_ids: new FormControl([]),
      }),
      slug: new FormControl('denver'),
    });
  }

  ngOnInit() {
    const categories$ = this.store.dispatch(
      new GetCategoriesAction({ status: 1, type: 'product' }),
    );
    const home_page$ = this.store.dispatch(new GetHomePageAction({ slug: 'denver' }));
    forkJoin([home_page$, categories$]).subscribe({
      complete: () => {
        this.store.select(ThemeState.homePage<IDenverContent>).subscribe({
          next: homePage => {
            if (homePage?.content?.products_ids) {
              this.filter['paginate'] =
                homePage?.content?.products_ids?.length >= 15
                  ? homePage?.content?.products_ids?.length
                  : 15;
              this.filter['ids'] = homePage?.content?.products_ids?.join();
              this.filter['with_union_products'] = homePage?.content?.products_ids?.length
                ? homePage?.content?.products_ids?.length >= 15
                  ? 0
                  : 1
                : 0;
            }
            this.store.dispatch(new GetProductsAction(this.filter)).subscribe({
              complete: () => {
                this.patchForm();
              },
            });
          },
        });
      },
    });

    this.search
      .pipe(debounceTime(300)) // Adjust the debounce time as needed (in milliseconds)
      .subscribe(inputValue => {
        this.store.dispatch(
          new GetProductsAction({ status: 1, is_approved: 1, paginate: 15, search: inputValue }),
        );
        this.renderer.addClass(this.document.body, 'loader-none');
      });
  }

  patchForm() {
    this.store.select(ThemeState.homePage<IDenverContent>).subscribe(homePage => {
      this.page_data = homePage;
      this.form.patchValue({
        content: {
          home_banner: {
            main_banner: {
              image_url: homePage?.content?.home_banner?.main_banner?.image_url,
              redirect_link: {
                link: homePage?.content?.home_banner?.main_banner?.redirect_link?.link,
                link_type: homePage?.content?.home_banner?.main_banner?.redirect_link?.link_type,
                product_ids:
                  homePage?.content?.home_banner?.main_banner?.redirect_link?.product_ids,
              },
            },
          },
          categories_icon_list: {
            status: homePage?.content?.categories_icon_list?.status,
            category_ids: homePage?.content?.categories_icon_list?.category_ids,
            image_url: homePage?.content?.categories_icon_list?.image_url,
          },
          products_list_1: {
            title: homePage?.content?.products_list_1?.title,
            product_ids: homePage?.content?.products_list_1?.product_ids,
            status: homePage?.content?.products_list_1?.status,
          },
          two_column_banners: {
            status: homePage?.content?.two_column_banners?.status,
            banner_1: {
              image_url: homePage?.content?.two_column_banners?.banner_1?.image_url,
              redirect_link: {
                link: homePage?.content?.two_column_banners?.banner_1?.redirect_link?.link,
                link_type:
                  homePage?.content?.two_column_banners?.banner_1?.redirect_link?.link_type,
                product_ids:
                  homePage?.content?.two_column_banners?.banner_1?.redirect_link?.product_ids,
              },
            },
            banner_2: {
              image_url: homePage?.content?.two_column_banners?.banner_2?.image_url,
              redirect_link: {
                link: homePage?.content?.two_column_banners?.banner_2?.redirect_link?.link,
                link_type:
                  homePage?.content?.two_column_banners?.banner_2?.redirect_link?.link_type,
                product_ids:
                  homePage?.content?.two_column_banners?.banner_1?.redirect_link?.product_ids,
              },
            },
          },
          slider_product_with_banner: {
            slider_products: {
              status: homePage?.content?.slider_product_with_banner?.slider_products?.status,
              product_slider_1: {
                title:
                  homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_1
                    ?.title,
                product_ids:
                  homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_1
                    ?.product_ids,
                status:
                  homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_1
                    ?.status,
              },
              product_slider_2: {
                title:
                  homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_2
                    ?.title,
                product_ids:
                  homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_2
                    ?.product_ids,
                status:
                  homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_2
                    ?.status,
              },
              product_slider_3: {
                title:
                  homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_3
                    ?.title,
                product_ids:
                  homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_3
                    ?.product_ids,
                status:
                  homePage?.content?.slider_product_with_banner?.slider_products?.product_slider_3
                    ?.status,
              },
            },
            left_side_banners: {
              status: homePage?.content?.slider_product_with_banner?.left_side_banners?.status,
              banner_1: {
                redirect_link: {
                  link: homePage?.content?.slider_product_with_banner?.left_side_banners?.banner_1
                    ?.redirect_link?.link,
                  link_type:
                    homePage?.content?.slider_product_with_banner?.left_side_banners?.banner_1
                      ?.redirect_link?.link_type,
                  product_ids:
                    homePage?.content?.slider_product_with_banner?.left_side_banners?.banner_1
                      ?.redirect_link?.product_ids,
                },
                image_url:
                  homePage?.content?.slider_product_with_banner?.left_side_banners?.banner_1
                    ?.image_url,
              },
            },
          },
          coupon_banner: {
            status: homePage?.content?.coupon_banner?.status,
            image_url: homePage?.content?.coupon_banner?.image_url,
            redirect_link: {
              link: homePage?.content?.coupon_banner?.redirect_link?.link,
              link_type: homePage?.content?.coupon_banner?.redirect_link?.link_type,
              product_ids: homePage?.content?.coupon_banner?.redirect_link?.product_ids,
            },
          },
          products_list_2: {
            title: homePage?.content?.products_list_2?.title,
            product_ids: homePage?.content?.products_list_2?.product_ids,
            status: homePage?.content?.products_list_2?.status,
          },
          products_list_3: {
            title: homePage?.content?.products_list_3?.title,
            product_ids: homePage?.content?.products_list_3?.product_ids,
            status: homePage?.content?.products_list_3?.status,
          },
          news_letter: {
            title: homePage?.content?.news_letter?.title,
            status: homePage?.content?.news_letter?.status,
            image_url: homePage?.content?.news_letter?.image_url,
            sub_title: homePage?.content?.news_letter?.sub_title,
          },
          products_ids: homePage?.content?.products_ids,
        },
        slug: homePage?.slug,
      });
    });
  }

  getProducts(filter: Params) {
    this.filter['search'] = filter['search'];
    this.filter['ids'] = this.filter['search'].length
      ? ''
      : this.page_data?.content?.products_ids?.join();
    this.filter['paginate'] =
      this.page_data?.content?.products_ids?.length >= 15
        ? this.page_data?.content?.products_ids?.length
        : 15;
    this.store.dispatch(new GetProductsAction(this.filter));
    this.renderer.addClass(this.document.body, 'loader-none');
  }

  productDropdown(event: Select2) {
    if (event['innerSearchText']) {
      this.search.next('');
      this.getProducts(this.filter);
    }
  }

  searchProduct(event: Select2SearchEvent) {
    this.search.next(event.search);
  }

  // Merge Products Ids
  concatDynamicProductKeys(obj: IDenver): number[] {
    const result: number[] = [];

    function traverse(value: unknown): void {
      if (Array.isArray(value)) {
        value.forEach(traverse);
      } else if (value !== null && typeof value === 'object') {
        for (const [key, nested] of Object.entries(value)) {
          if (
            key === 'product_ids' &&
            Array.isArray(nested) &&
            nested.every(item => typeof item === 'number')
          ) {
            result.push(...nested);
          } else {
            traverse(nested);
          }
        }
      }
    }

    traverse(obj);
    return result;
  }

  selectBanner(url: string, key: string) {
    this.form.get(key)?.setValue(url ? url : null);
  }

  submit() {
    const productIds = Array.from(new Set(this.concatDynamicProductKeys(this.form.value)));
    this.form.get('content.products_ids')?.setValue(productIds);

    if (this.form.valid) {
      this.store.dispatch(new UpdateHomePageAction(this.page_data.id, this.form.value));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
