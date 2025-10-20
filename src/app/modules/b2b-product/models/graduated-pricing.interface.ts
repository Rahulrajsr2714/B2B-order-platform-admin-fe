export interface IGraduatedPrice {
  id?: string;
  productId: string;
  minQuantity: number;
  maxQuantity: number;
  unitCode: string;
  unitPrice: number;
  priceType: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGraduatedPricingFormData {
  productId: string;
  productName: string;
  prices: IGraduatedPrice[];
}

export interface IGraduatedPricingResponse {
  success: boolean;
  message: string;
  data: IGraduatedPrice[];
}
