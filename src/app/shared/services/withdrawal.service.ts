import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../../public/environments/environment';
import { Params } from '../interface/core.interface';
import { IWithdrawalModel } from '../interface/withdrawal.interface';

@Injectable({
  providedIn: 'root',
})
export class WithdrawalService {
  private http = inject(HttpClient);

  getWithdrawRequest(payload?: Params): Observable<IWithdrawalModel> {
    return this.http.get<IWithdrawalModel>(`${environment.URL}/withdraw.json`, { params: payload });
  }
}
