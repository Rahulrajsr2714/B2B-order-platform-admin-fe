import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../../public/environments/environment';
import { IThemesModel } from '../interface/theme.interface';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private http = inject(HttpClient);

  getThemes(): Observable<IThemesModel> {
    return this.http.get<IThemesModel>(`${environment.URL}/theme.json`);
  }

  getHomePage<T>(slug?: string): Observable<{ id: number; slug: string; content: T }> {
    if (!slug) {
      slug = 'paris';
    }
    return this.http.get<{ id: number; slug: string; content: T }>(
      `${environment.URL}/themes/${slug}.json`,
    );
  }
}
