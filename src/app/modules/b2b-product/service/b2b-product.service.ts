import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Params } from '@angular/router';

import { Observable } from 'rxjs';

import { environment } from 'public/environments/environment';

import { IB2bProduct, IB2bProductModel } from '../models/b2b-product.interface';

@Injectable({
  providedIn: 'root',
})
export class B2bProductService {
  private http = inject(HttpClient);

  getProducts(payload?: Params): Observable<IB2bProductModel> {
    return this.http.get<IB2bProductModel>(`${environment.API_URL}/products`, {
      params: payload,
    });
  }

  create(
    payload: Partial<IB2bProduct> & { images?: File[] },
  ): Observable<IB2bProduct> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    return this.http.post<IB2bProduct>(
      `${environment.API_URL}/products`,
      formData,
    );
  }

  update(
    id: string,
    payload: Partial<IB2bProduct> & { images?: File[] },
  ): Observable<IB2bProduct> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    return this.http.put<IB2bProduct>(
      `${environment.API_URL}/products/${id}`,
      formData,
    );
  }

  getProduct(id: string) {
    return this.http.get<IB2bProduct>(`${environment.API_URL}/products/${id}`);
  }

  // deleteBrand(id: string) {
  //   return this.http.delete<IBrand>(`${environment.API_URL}/brand/${id}`);
  // }

  // toggleActive(id: string) {
  //   return this.http.patch<IBrand>(
  //     `${environment.API_URL}/brand/${id}/toggle-active`,
  //     {},
  //   );
  // }
}
