import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Params } from '@angular/router';

import { Observable } from 'rxjs';

import { environment } from 'public/environments/environment';
import { IBrand, IBrandModel } from '../models/brand.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private http = inject(HttpClient);

  getBrands(payload?: Params): Observable<IBrandModel> {
    return this.http.get<IBrandModel>(`${environment.API_URL}/brand`, {
      params: payload,
    });
  }

  create(payload: Partial<IBrand> & { logo?: File }): Observable<IBrand> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'logo' && value instanceof File) {
        formData.append('logo', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    return this.http.post<IBrand>(`${environment.API_URL}/brand`, formData);
  }

  update(
    id: string,
    payload: Partial<IBrand> & { logo?: File },
  ): Observable<IBrandModel> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'logo' && value instanceof File) {
        formData.append('logo', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    return this.http.put<IBrandModel>(
      `${environment.API_URL}/brand/${id}`,
      formData,
    );
  }

  getBrand(id: string) {
    return this.http.get<IBrand>(`${environment.API_URL}/brand/${id}`);
  }

  deleteBrand(id: string) {
    return this.http.delete<IBrand>(`${environment.API_URL}/brand/${id}`);
  }

  toggleActive(id: string) {
    return this.http.patch<IBrand>(
      `${environment.API_URL}/brand/${id}/toggle-active`,
      {},
    );
  }
}
