import { Injectable, inject } from '@angular/core';

import { Store, Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  GetProductsAction,
  CreateProductAction,
  EditProductAction,
  UpdateProductAction,
  UpdateProductStatusAction,
  ApproveProductStatusAction,
  DeleteProductAction,
  DeleteAllProductAction,
  ReplicateProductAction,
} from '../action/product.action';
import { IProduct, IProductModel } from '../interface/product.interface';
import { NotificationService } from '../services/notification.service';
import { ProductService } from '../services/product.service';

export class ProductStateModel {
  product = {
    data: [] as IProduct[],
    total: 0,
  };
  selectedProduct: IProduct | null;
  topSellingProducts: IProduct[];
}

@State<ProductStateModel>({
  name: 'product',
  defaults: {
    product: {
      data: [],
      total: 0,
    },
    selectedProduct: null,
    topSellingProducts: [],
  },
})
@Injectable()
export class ProductState {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private productService = inject(ProductService);

  @Selector()
  static product(state: ProductStateModel) {
    return state.product;
  }

  @Selector()
  static products(state: ProductStateModel) {
    return state.product.data
      .filter(data => data.id !== state.selectedProduct?.id)
      .map((res: IProduct) => {
        return {
          label: res?.name,
          value: res?.id,
          data: {
            type: res.type,
            name: res.name,
            slug: res.slug,
            stock_status: res.stock_status,
            image: res.product_thumbnail
              ? res.product_thumbnail.original_url
              : 'assets/images/product.png',
          },
        };
      });
  }

  @Selector()
  static selectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }

  @Selector()
  static topSellingProducts(state: ProductStateModel) {
    return state.topSellingProducts;
  }

  @Action(GetProductsAction)
  getProducts(ctx: StateContext<ProductStateModel>, action: GetProductsAction) {
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: IProductModel) => {
          if (action?.payload!['top_selling']) {
            const state = ctx.getState();
            ctx.patchState({
              ...state,
              topSellingProducts: result?.data?.slice(0, 7),
            });
          } else {
            ctx.patchState({
              product: {
                data: result?.data,
                total: result?.total ? result?.total : result.data ? result.data.length : 0,
              },
            });
          }
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(CreateProductAction)
  create(_ctx: StateContext<ProductStateModel>, _action: CreateProductAction) {
    // Product Create Logic Here
  }

  @Action(EditProductAction)
  edit(ctx: StateContext<ProductStateModel>, { id }: EditProductAction) {
    return this.productService.getProducts().pipe(
      tap({
        next: results => {
          const state = ctx.getState();
          const result = results.data.find(product => product.id == id);
          ctx.patchState({
            ...state,
            selectedProduct: result,
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
      }),
    );
  }

  @Action(UpdateProductAction)
  update(
    _ctx: StateContext<ProductStateModel>,
    { payload: _payload, id: _id }: UpdateProductAction,
  ) {
    // Product Update Logic Here
  }

  @Action(UpdateProductStatusAction)
  updateStatus(
    _ctx: StateContext<ProductStateModel>,
    { id: _id, status: _status }: UpdateProductStatusAction,
  ) {
    // Product Update Status Logic Here
  }

  @Action(ApproveProductStatusAction)
  approveStatus(
    _ctx: StateContext<ProductStateModel>,
    { id: _id, status: _status }: ApproveProductStatusAction,
  ) {
    // Product Approve Status Logic Here
  }

  @Action(DeleteProductAction)
  delete(_ctx: StateContext<ProductStateModel>, { id: _id }: DeleteProductAction) {
    // Product Delete Logic Here
  }

  @Action(DeleteAllProductAction)
  deleteAll(_ctx: StateContext<ProductStateModel>, { ids: _ids }: DeleteAllProductAction) {
    // Product Delete All Logic Here
  }

  @Action(ReplicateProductAction)
  replicateProduct(_ctx: StateContext<ProductStateModel>, { ids: _ids }: ReplicateProductAction) {
    // Product Replicate Logic Here
  }
}
