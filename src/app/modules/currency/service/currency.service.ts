import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Params } from '@angular/router';

import { Observable } from 'rxjs';

import { environment } from 'public/environments/environment';

import { ICurrency, ICurrencyModel } from '../models/currency.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private http = inject(HttpClient);

  getCurrencies(payload?: Params): Observable<ICurrencyModel> {
    return this.http.get<ICurrencyModel>(`${environment.API_URL}/currency`, {
      params: payload,
    });
  }

  create(payload: Partial<ICurrency>): Observable<ICurrency> {
    return this.http.post<ICurrency>(
      `${environment.API_URL}/currency`,
      payload,
    );
  }

  update(id: string, payload: Partial<ICurrency>): Observable<ICurrencyModel> {
    return this.http.patch<ICurrencyModel>(
      `${environment.API_URL}/currency/${id}`,
      payload,
    );
  }

  getCurrency(id: string) {
    return this.http.get<ICurrency>(`${environment.API_URL}/currency/${id}`);
  }

  deleteCurrency(id: string) {
    return this.http.delete<ICurrency>(`${environment.API_URL}/currency/${id}`);
  }
}
