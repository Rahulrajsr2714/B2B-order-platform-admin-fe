import { CommonModule } from '@angular/common';
import { Component, DOCUMENT, inject, Renderer2 } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { GetCartItemsAction, UpdateCartAction } from '../../../shared/action/cart.action';
import { GetCategoriesAction } from '../../../shared/action/category.action';
import { GetProductsAction } from '../../../shared/action/product.action';
import { Loader } from '../../../shared/components/loader/loader';
import { AdvancedDropdown } from '../../../shared/components/ui/advanced-dropdown/advanced-dropdown';
import { Button } from '../../../shared/components/ui/button/button';
import { NoData } from '../../../shared/components/ui/no-data/no-data';
import { Pagination } from '../../../shared/components/ui/pagination/pagination';
import { ProductBox } from '../../../shared/components/ui/product-box/product-box';
import { ProductBoxSkeleton } from '../../../shared/components/ui/skeleton/product-box-skeleton/product-box-skeleton';
import { HasPermissionDirective } from '../../../shared/directive/has-permission.directive';
import { ICart, ICartAddOrUpdate } from '../../../shared/interface/cart.interface';
import { ICategory, ICategoryModel } from '../../../shared/interface/category.interface';
import { Params } from '../../../shared/interface/core.interface';
import { IProductModel } from '../../../shared/interface/product.interface';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency-symbol.pipe';
import { CartState } from '../../../shared/state/cart.state';
import { CategoryState } from '../../../shared/state/category.state';
import { LoaderState } from '../../../shared/state/loader.state';
import { ProductState } from '../../../shared/state/product.state';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.html',
  styleUrls: ['./create-order.scss'],
  imports: [
    Loader,
    CarouselModule,
    ReactiveFormsModule,
    FormsModule,
    AdvancedDropdown,
    ProductBoxSkeleton,
    ProductBox,
    Pagination,
    NoData,
    Button,
    HasPermissionDirective,
    RouterModule,
    CommonModule,
    TranslateModule,
    CurrencySymbolPipe,
  ],
})
export class CreateOrder {
  private store = inject(Store);
  private document = inject<Document>(DOCUMENT);
  private renderer = inject(Renderer2);

  loadingStatus$: Observable<boolean> = inject(Store).select(
    LoaderState.status,
  ) as Observable<boolean>;
  category$: Observable<ICategoryModel> = inject(Store).select(
    CategoryState.category,
  ) as Observable<ICategoryModel>;
  product$: Observable<IProductModel> = inject(Store).select(ProductState.product);
  cartItem$: Observable<ICart[]> = inject(Store).select(CartState.cartItems);
  cartTotal$: Observable<number> = inject(Store).select(CartState.cartTotal);

  public skeletonItems = Array.from({ length: 8 }, (_, index) => index);
  public activeCategory: ICategory | null;
  public selectedCategory: Number[] = [];
  public totalItems: number = 0;
  public filter = {
    search: '',
    field: '',
    sort: '', // current Sorting Order
    page: 1, // current page number
    paginate: 20, // Display per page,
    category_ids: '',
  };

  public customOptions: OwlOptions = {
    loop: true,
    margin: 15,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 5,
      },
    },
    nav: true,
  };
  public term = new FormControl();
  public loading: boolean = true;

  constructor() {
    this.store.dispatch(new GetCategoriesAction({ type: 'product', status: 1 }));
    this.product$.subscribe(product => (this.totalItems = product?.total));
    this.getProducts(this.filter, true);
    this.store.dispatch(new GetCartItemsAction());

    this.term.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((data: string) => {
        this.filter.search = data;
        this.getProducts(this.filter);
      });
  }

  getProducts(filter: Params, loader?: boolean) {
    this.loading = true;
    filter['status'] = 1;
    this.store.dispatch(new GetProductsAction(filter)).subscribe({
      complete: () => {
        this.loading = false;
      },
    });
    if (!loader) this.renderer.addClass(this.document.body, 'loader-none');
  }

  selectCategory(data: ICategory) {
    this.activeCategory = this.activeCategory?.id != data?.id ? data : null;
    this.selectedCategory = [];
    this.filter.category_ids = String(this.activeCategory ? this.activeCategory?.id! : '');
    this.getProducts(this.filter);
  }

  selectCategoryItem(data: Number[]) {
    this.activeCategory = null;
    this.filter.category_ids = data.join();
    this.getProducts(this.filter);
  }

  updateQuantity(item: ICart, qty: number) {
    this.renderer.addClass(this.document.body, 'loader-none');
    const params: ICartAddOrUpdate = {
      id: item?.id,
      product_id: item?.product?.id!,
      product: item?.product,
      variation: item?.variation,
      variation_id: item?.variation_id ? item?.variation_id : null,
      quantity: qty,
    };
    this.store.dispatch(new UpdateCartAction(params));
  }

  setPaginate(data: number) {
    this.filter.page = data;
    this.getProducts(this.filter);
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }
}
