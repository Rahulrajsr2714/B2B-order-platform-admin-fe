import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Params } from '@angular/router';

import { Observable } from 'rxjs';

import { environment } from 'public/environments/environment';

import { ICategoryModel } from '../models/category.interface';

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
}
