import { Component, inject, input, viewChild } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { CartState } from 'src/app/shared/state/cart.state';

import { AddToCartAction } from '../../../action/cart.action';
import { ICart, ICartAddOrUpdate } from '../../../interface/cart.interface';
import { IProduct } from '../../../interface/product.interface';
import { CurrencySymbolPipe } from '../../../pipe/currency-symbol.pipe';
import { Button } from '../button/button';
import { Addtocart } from './modal/addtocart/addtocart';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.html',
  styleUrls: ['./product-box.scss'],
  imports: [Button, Addtocart, TranslateModule, CurrencySymbolPipe],
})
export class ProductBox {
  private store = inject(Store);

  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  readonly product = input<IProduct>(undefined);

  cartItem$: Observable<ICart[]> = inject(Store).select(CartState.cartItems) as Observable<ICart[]>;
  readonly addToCartModal = viewChild<Addtocart>('addToCartModal');

  public cartItem: ICart | null;

  ngOnInit() {
    this.cartItem$.subscribe(items => {
      this.cartItem = items.find(item => item.product.id == this.product().id)!;
    });
  }

  addToCart(product: IProduct, qty: number) {
    const params: ICartAddOrUpdate = {
      id: this.cartItem ? this.cartItem.id : null,
      product_id: product?.id!,
      product: product,
      variation: null,
      variation_id: null,
      quantity: qty,
    };
    this.store.dispatch(new AddToCartAction(params));
  }
}
