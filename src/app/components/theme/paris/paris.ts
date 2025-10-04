import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, DOCUMENT, inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { NgbAccordionModule, NgbNavModule, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Select2, Select2Data, Select2Module, Select2SearchEvent } from 'ng-select2-component';
import { debounceTime, forkJoin, Observable, Subject } from 'rxjs';

import { GetBlogsAction } from '../../../shared/action/blog.action';
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
import { IBanners, IContent, IParis } from '../../../shared/interface/theme.interface';
import { BlogState } from '../../../shared/state/blog.state';
import { CategoryState } from '../../../shared/state/category.state';
import { ProductState } from '../../../shared/state/product.state';
import { ThemeState } from '../../../shared/state/theme.state';

export type CustomLinkForm = AbstractControl & {
  controls: { [key: string]: AbstractControl };
  registerControl: (name: string, control: AbstractControl) => void;
  addControl: (name: string, control: AbstractControl) => void;
  removeControl: (name: string) => void;
  setControl: (name: string, control: AbstractControl) => void;
};

@Component({
  selector: 'app-paris',
  templateUrl: './paris.html',
  styleUrls: ['./paris.scss'],
  imports: [
    PageWrapper,
    ReactiveFormsModule,
    NgbNavModule,
    FormFields,
    ImageUpload,
    Link,
    NgbNavOutlet,
    Button,
    NgbAccordionModule,
    Select2Module,
    HasPermissionDirective,
    CommonModule,
    TranslateModule,
  ],
})
export class Paris {
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private document = inject<Document>(DOCUMENT);

  product$: Observable<Select2Data> = inject(Store).select(ProductState.products);
  home_page$: Observable<IParis> = inject(Store).select(ThemeState.homePage<IContent>);
  categories$: Observable<Select2Data> = inject(Store).select(CategoryState.categories);
  blogs$: Observable<Select2Data> = inject(Store).select(BlogState.blogs);

  public form: FormGroup;
  public page_data: IParis;
  public active = 'home_banner';
  public banner = 1;
  public sub_banner = 1;
  public main_content = 1;
  public sort = data.sort;
  public productIds: number[] = [];

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
          status: new FormControl(true),
          main_banner: new FormGroup({
            image_url: new FormControl(),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
          sub_banner_1: new FormGroup({
            image_url: new FormControl(),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
          sub_banner_2: new FormGroup({
            image_url: new FormControl(),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
          }),
        }),
        featured_banners: new FormGroup({
          status: new FormControl(true),
          banners: new FormArray([]),
        }),
        main_content: new FormGroup({
          status: new FormControl(true),
          sidebar: new FormGroup({
            status: new FormControl(true),
            categories_icon_list: new FormGroup({
              title: new FormControl(),
              category_ids: new FormControl([]),
              status: new FormControl(true),
            }),
            left_side_banners: new FormGroup({
              status: new FormControl(true),
              banner_1: new FormGroup({
                image_url: new FormControl(),
                redirect_link: new FormGroup({
                  link: new FormControl(''),
                  link_type: new FormControl(''),
                  product_ids: new FormControl(''),
                }),
              }),
              banner_2: new FormGroup({
                image_url: new FormControl(),
                redirect_link: new FormGroup({
                  link: new FormControl(''),
                  link_type: new FormControl(''),
                  product_ids: new FormControl(''),
                }),
              }),
            }),
            sidebar_products: new FormGroup({
              title: new FormControl(),
              status: new FormControl(true),
              product_ids: new FormControl([]),
            }),
          }),
          section1_products: new FormGroup({
            title: new FormControl(),
            description: new FormControl(),
            product_ids: new FormControl([]),
            status: new FormControl(true),
          }),
          section2_categories_list: new FormGroup({
            image_url: new FormControl(),
            title: new FormControl(),
            description: new FormControl(),
            category_ids: new FormControl([]),
            status: new FormControl(true),
          }),
          section3_two_column_banners: new FormGroup({
            status: new FormControl(true),
            banner_1: new FormGroup({
              image_url: new FormControl(),
              redirect_link: new FormGroup({
                link: new FormControl(''),
                link_type: new FormControl(''),
                product_ids: new FormControl(''),
              }),
            }),
            banner_2: new FormGroup({
              image_url: new FormControl(),
              redirect_link: new FormGroup({
                link: new FormControl(''),
                link_type: new FormControl(''),
                product_ids: new FormControl(''),
              }),
            }),
          }),
          section4_products: new FormGroup({
            title: new FormControl(),
            description: new FormControl(),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          }),
          section5_coupons: new FormGroup({
            image_url: new FormControl(),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
            status: new FormControl(true),
          }),
          section6_two_column_banners: new FormGroup({
            status: new FormControl(true),
            banner_1: new FormGroup({
              image_url: new FormControl(),
              redirect_link: new FormGroup({
                link: new FormControl(''),
                link_type: new FormControl(''),
              }),
            }),
            banner_2: new FormGroup({
              image_url: new FormControl(),
              redirect_link: new FormGroup({
                link: new FormControl(''),
                link_type: new FormControl(''),
                product_ids: new FormControl(''),
              }),
            }),
          }),
          section7_products: new FormGroup({
            title: new FormControl(),
            description: new FormControl(),
            status: new FormControl(true),
            product_ids: new FormControl([]),
          }),
          section8_full_width_banner: new FormGroup({
            image_url: new FormControl(),
            redirect_link: new FormGroup({
              link: new FormControl(''),
              link_type: new FormControl(''),
              product_ids: new FormControl(''),
            }),
            status: new FormControl(true),
          }),
          section9_featured_blogs: new FormGroup({
            title: new FormControl(),
            description: new FormControl(),
            status: new FormControl(true),
            blog_ids: new FormControl([]),
          }),
        }),
        news_letter: new FormGroup({
          title: new FormControl(),
          sub_title: new FormControl(),
          image_url: new FormControl(),
          status: new FormControl(true),
        }),
        products_ids: new FormControl([]),
      }),
      slug: new FormControl('paris'),
    });
  }

  get bannersArray(): FormArray {
    return this.form.get('content.featured_banners.banners') as FormArray;
  }

  ngOnInit() {
    const blogs$ = this.store.dispatch(new GetBlogsAction({ status: 1 }));
    const home_page$ = this.store.dispatch(new GetHomePageAction({ slug: 'paris' }));
    const categories$ = this.store.dispatch(
      new GetCategoriesAction({ status: 1, type: 'product' }),
    );

    forkJoin([blogs$, home_page$, categories$]).subscribe({
      complete: () => {
        this.store.select(ThemeState.homePage<IContent>).subscribe({
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
        this.filter['search'] = inputValue;
        this.getProducts(this.filter);
        if (this.isBrowser) {
          this.renderer.addClass(this.document.body, 'loader-none');
        }
      });
  }

  patchForm() {
    this.store.select(ThemeState.homePage<IContent>).subscribe(homePage => {
      this.page_data = homePage;

      this.form.patchValue({
        content: {
          home_banner: {
            status: homePage?.content?.home_banner?.status,
            main_banner: {
              image_url: homePage?.content?.home_banner?.main_banner?.image_url,
              redirect_link: {
                link: homePage?.content?.home_banner?.main_banner?.redirect_link?.link,
                link_type: homePage?.content?.home_banner?.main_banner?.redirect_link?.link_type,
                product_ids:
                  homePage?.content?.home_banner?.main_banner?.redirect_link?.product_ids,
              },
            },
            sub_banner_1: {
              image_url: homePage?.content?.home_banner?.sub_banner_1?.image_url,
              redirect_link: {
                link: homePage?.content?.home_banner?.sub_banner_1?.redirect_link?.link,
                link_type: homePage?.content?.home_banner?.sub_banner_1?.redirect_link?.link_type,
                product_ids:
                  homePage?.content?.home_banner?.sub_banner_1?.redirect_link?.product_ids,
              },
            },
            sub_banner_2: {
              image_url: homePage?.content?.home_banner?.sub_banner_2?.image_url,
              redirect_link: {
                link: homePage?.content?.home_banner?.sub_banner_2?.redirect_link?.link,
                link_type: homePage?.content?.home_banner?.sub_banner_2?.redirect_link?.link_type,
                product_ids:
                  homePage?.content?.home_banner?.sub_banner_2?.redirect_link?.product_ids,
              },
            },
          },
          featured_banners: {
            status: homePage?.content?.featured_banners?.status,
          },
          main_content: {
            status: homePage?.content?.main_content?.status,
            sidebar: {
              status: homePage?.content?.main_content?.sidebar.status,
              categories_icon_list: {
                image_url:
                  homePage?.content?.main_content?.sidebar?.categories_icon_list?.image_url,
                title: homePage?.content?.main_content?.sidebar?.categories_icon_list?.title,
                category_ids:
                  homePage?.content?.main_content?.sidebar?.categories_icon_list?.category_ids,
                status: homePage?.content?.main_content?.sidebar?.categories_icon_list?.status,
              },
              left_side_banners: {
                status: homePage?.content?.main_content?.sidebar?.left_side_banners?.status,
                banner_1: {
                  image_url:
                    homePage?.content?.main_content?.sidebar?.left_side_banners?.banner_1
                      ?.image_url,
                  redirect_link: {
                    link: homePage?.content?.main_content?.sidebar?.left_side_banners?.banner_1
                      ?.redirect_link?.link,
                    link_type:
                      homePage?.content?.main_content?.sidebar?.left_side_banners?.banner_1
                        ?.redirect_link?.link_type,
                    product_ids:
                      homePage?.content?.main_content?.sidebar?.left_side_banners?.banner_1
                        ?.redirect_link?.product_ids,
                  },
                },
                banner_2: {
                  image_url:
                    homePage?.content?.main_content?.sidebar?.left_side_banners?.banner_2
                      ?.image_url,
                  redirect_link: {
                    link: homePage?.content?.main_content?.sidebar?.left_side_banners?.banner_2
                      ?.redirect_link?.link,
                    link_type:
                      homePage?.content?.main_content?.sidebar?.left_side_banners?.banner_2
                        ?.redirect_link?.link_type,
                    product_ids:
                      homePage?.content?.main_content?.sidebar?.left_side_banners?.banner_1
                        ?.redirect_link?.product_ids,
                  },
                },
              },
              sidebar_products: {
                title: homePage?.content?.main_content?.sidebar?.sidebar_products?.title,
                status: homePage?.content?.main_content?.sidebar?.sidebar_products?.status,
                product_ids:
                  homePage?.content?.main_content?.sidebar?.sidebar_products?.product_ids,
              },
            },
            section1_products: {
              title: homePage?.content?.main_content?.section1_products?.title,
              description: homePage?.content?.main_content?.section1_products?.description,
              product_ids: homePage?.content?.main_content?.section1_products?.product_ids,
              status: homePage?.content?.main_content?.section1_products?.status,
            },
            section2_categories_list: {
              title: homePage?.content?.main_content?.section2_categories_list?.title,
              description: homePage?.content?.main_content?.section2_categories_list?.description,
              image_url: homePage?.content?.main_content?.section2_categories_list?.image_url,
              category_ids: homePage?.content?.main_content?.section2_categories_list?.category_ids,
              status: homePage?.content?.main_content?.section2_categories_list?.status,
            },
            section3_two_column_banners: {
              status: homePage?.content?.main_content?.section3_two_column_banners?.status,
              banner_1: {
                image_url:
                  homePage?.content?.main_content?.section3_two_column_banners?.banner_1?.image_url,
                redirect_link: {
                  link: homePage?.content?.main_content?.section3_two_column_banners?.banner_1
                    ?.redirect_link?.link,
                  link_type:
                    homePage?.content?.main_content?.section3_two_column_banners?.banner_1
                      ?.redirect_link?.link_type,
                  product_ids:
                    homePage?.content?.main_content?.section3_two_column_banners?.banner_1
                      ?.redirect_link?.product_ids,
                },
              },
              banner_2: {
                image_url:
                  homePage?.content?.main_content?.section3_two_column_banners?.banner_2?.image_url,
                redirect_link: {
                  link: homePage?.content?.main_content?.section3_two_column_banners?.banner_2
                    ?.redirect_link?.link,
                  link_type:
                    homePage?.content?.main_content?.section3_two_column_banners?.banner_2
                      ?.redirect_link?.link_type,
                  product_ids:
                    homePage?.content?.main_content?.section3_two_column_banners?.banner_2
                      ?.redirect_link?.product_ids,
                },
              },
            },
            section4_products: {
              title: homePage?.content?.main_content?.section4_products?.title,
              description: homePage?.content?.main_content?.section4_products?.description,
              status: homePage?.content?.main_content?.section4_products?.status,
              product_ids: homePage?.content?.main_content?.section4_products?.product_ids,
            },
            section5_coupons: {
              image_url: homePage?.content?.main_content?.section5_coupons?.image_url,
              status: homePage?.content?.main_content?.section5_coupons?.status,
              redirect_link: {
                link: homePage?.content?.main_content?.section5_coupons?.redirect_link?.link,
                link_type:
                  homePage?.content?.main_content?.section5_coupons?.redirect_link?.link_type,
                product_ids:
                  homePage?.content?.main_content?.section5_coupons?.redirect_link?.product_ids,
              },
            },
            section6_two_column_banners: {
              status: homePage?.content?.main_content?.section6_two_column_banners?.status,
              banner_1: {
                image_url:
                  homePage?.content?.main_content?.section6_two_column_banners?.banner_1?.image_url,
                redirect_link: {
                  link: homePage?.content?.main_content?.section6_two_column_banners?.banner_2
                    ?.redirect_link?.link,
                  link_type:
                    homePage?.content?.main_content?.section6_two_column_banners?.banner_2
                      ?.redirect_link?.link_type,
                  product_ids:
                    homePage?.content?.main_content?.section6_two_column_banners?.banner_2
                      ?.redirect_link?.product_ids,
                },
              },
              banner_2: {
                image_url:
                  homePage?.content?.main_content?.section6_two_column_banners?.banner_2?.image_url,
                redirect_link: {
                  link: homePage?.content?.main_content?.section6_two_column_banners?.banner_2
                    ?.redirect_link?.link,
                  link_type:
                    homePage?.content?.main_content?.section6_two_column_banners?.banner_2
                      ?.redirect_link?.link_type,
                  product_ids:
                    homePage?.content?.main_content?.section6_two_column_banners?.banner_2
                      ?.redirect_link?.link_type,
                },
              },
            },
            section7_products: {
              title: homePage?.content?.main_content?.section7_products?.title,
              description: homePage?.content?.main_content?.section7_products?.description,
              status: homePage?.content?.main_content?.section7_products?.status,
              product_ids: homePage?.content?.main_content?.section7_products?.product_ids,
            },
            section8_full_width_banner: {
              image_url: homePage?.content?.main_content?.section8_full_width_banner?.image_url,
              status: homePage?.content?.main_content?.section8_full_width_banner?.status,
              redirect_link: {
                link: homePage?.content?.main_content?.section8_full_width_banner?.redirect_link
                  ?.link,
                link_type:
                  homePage?.content?.main_content?.section8_full_width_banner?.redirect_link
                    ?.link_type,
                product_ids:
                  homePage?.content?.main_content?.section8_full_width_banner?.redirect_link
                    ?.product_ids,
              },
            },
            section9_featured_blogs: {
              title: homePage?.content?.main_content?.section9_featured_blogs?.title,
              description: homePage?.content?.main_content?.section9_featured_blogs?.description,
              status: homePage?.content?.main_content?.section9_featured_blogs?.status,
              blog_ids: homePage?.content?.main_content?.section9_featured_blogs?.blog_ids,
            },
          },
          news_letter: {
            title: homePage?.content?.news_letter?.title,
            sub_title: homePage?.content?.news_letter?.sub_title,
            image_url: homePage?.content?.news_letter?.image_url,
            status: homePage?.content?.news_letter?.status,
          },
          products_ids: homePage?.content?.products_ids,
        },
        slug: homePage?.slug,
      });

      this.bannersArray.clear();
      homePage?.content?.featured_banners?.banners?.forEach((banner: IBanners) =>
        this.bannersArray.push(
          this.formBuilder.group({
            redirect_link: new FormGroup({
              link: new FormControl(banner?.redirect_link?.link),
              link_type: new FormControl(banner?.redirect_link?.link_type),
            }),
            status: new FormControl(banner?.status),
            image_url: new FormControl(banner?.image_url),
          }),
        ),
      );
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
    if (this.isBrowser) {
      this.renderer.addClass(this.document.body, 'loader-none');
    }
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

  addBanner(event: Event) {
    event.preventDefault();
    this.bannersArray.push(
      this.formBuilder.group({
        link: new FormControl(),
        image_url: new FormControl(),
        status: new FormControl(true),
      }),
    );
  }

  remove(index: number) {
    if (this.bannersArray.length <= 1) return;
    this.bannersArray.removeAt(index);
  }

  selectImage(url: string, key: string) {
    this.form.get(key)?.setValue(url ? url : null);
  }

  selectBannerArray(url: string, index: number) {
    this.bannersArray
      .at(index)
      .get('image_url')
      ?.setValue(url ? url : null);
  }

  // Merge Products Ids
  concatDynamicProductKeys(obj: IParis): number[] {
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
