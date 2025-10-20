import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from 'public/environments/environment';

import {
  IGraduatedPrice,
  IGraduatedPricingResponse,
} from '../models/graduated-pricing.interface';

@Injectable({
  providedIn: 'root',
})
export class GraduatedPricingService {
  private http = inject(HttpClient);

  createGraduatedPricing(price: IGraduatedPrice) {
    return this.http.post<IGraduatedPricingResponse>(
      `${environment.API_URL}/pricing/graduated-prices`,
      price,
    );
  }

  deleteGraduatedPricing(id: string) {
    return this.http.delete<IGraduatedPricingResponse>(
      `${environment.API_URL}/pricing/graduated-prices/${id}`,
    );
  }

  updateGraduatedPricing(productId: string, price: IGraduatedPrice) {
    return this.http.put<IGraduatedPricingResponse>(
      `${environment.API_URL}/pricing/graduated-prices/${productId}`,
      price,
    );
  }

  getGraduatedPricing(productId: string) {
    return this.http.get<IGraduatedPrice[]>(
      `${environment.API_URL}/pricing/graduated-prices?productId=${productId}`,
    );
  }

  bulkCreateGraduatedPricing(data: IGraduatedPrice[]) {
    return this.http.post<IGraduatedPricingResponse>(
      `${environment.API_URL}/pricing/graduated-prices/bulk`,
      { graduatedPrices: data },
    );
  }
}
