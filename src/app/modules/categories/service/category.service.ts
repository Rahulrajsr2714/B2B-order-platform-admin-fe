import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Params } from '@angular/router';

import { Observable } from 'rxjs';

import { environment } from 'public/environments/environment';

import { ICategory, ICategoryModel } from '../models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  getAllCategory(payload?: Params): Observable<ICategoryModel> {
    return this.http.get<ICategoryModel>(`${environment.API_URL}/category`, {
      params: payload,
    });
  }

  getAllCategoryAsList(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(
      `${environment.API_URL}/category/list-all`,
    );
  }

  getCategoryById(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${environment.API_URL}/category/${id}`);
  }

  create(payload: Partial<ICategory> & { logo?: File }): Observable<ICategory> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'picture' && value instanceof File) {
        formData.append('picture', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    return this.http.post<ICategory>(
      `${environment.API_URL}/category`,
      formData,
    );
  }

  update(
    id: string,
    payload: Partial<ICategory> & { logo?: File },
  ): Observable<ICategory> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'picture' && value instanceof File) {
        formData.append('picture', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    return this.http.put<ICategory>(
      `${environment.API_URL}/category/${id}`,
      formData,
    );
  }
}
