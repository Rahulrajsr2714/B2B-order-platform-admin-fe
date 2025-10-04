import { CurrencyPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { IValues } from '../interface/setting.interface';
import { SettingState } from '../state/setting.state';

@Pipe({
  name: 'currencySymbol',
  standalone: true,
})
export class CurrencySymbolPipe implements PipeTransform {
  private currencyPipe = inject(CurrencyPipe);

  setting$: Observable<IValues> = inject(Store).select(SettingState.setting) as Observable<IValues>;

  public symbol: string = '$';
  public setting: IValues;

  constructor() {
    this.setting$.subscribe(setting => (this.setting = setting));
  }

  transform(
    value: number,
    position: 'before_price' | 'after_price' | string = 'before_price',
  ): string {
    if (!value) {
      value = 0;
    }

    value = Number(value);

    value = value * this.setting?.general?.default_currency?.exchange_rate!;

    this.symbol = this.setting?.general?.default_currency?.symbol || this.symbol;
    position = this.setting?.general?.default_currency?.symbol_position || position;

    let formattedValue = value && this.currencyPipe.transform(value?.toFixed(2), this.symbol);
    formattedValue = formattedValue && formattedValue?.replace(this.symbol, '')!;

    if (position === 'before_price') {
      return `${this.symbol}${formattedValue}`;
    } else {
      return `${formattedValue}${this.symbol}`;
    }
  }
}
