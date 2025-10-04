import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../../public/environments/environment';
import { Params } from '../interface/core.interface';
import { IBadges } from '../interface/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private http = inject(HttpClient);

  // Search Box
  public search: boolean = false;

  public collapseSidebar: boolean = false;
  public sidebarLoading: boolean = false;

  getBadges(payload?: Params): Observable<IBadges> {
    return this.http.get<IBadges>(`${environment.URL}/badge.json`, payload);
  }
}
