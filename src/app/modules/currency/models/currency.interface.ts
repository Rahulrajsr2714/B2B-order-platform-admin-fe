import { IPaginateModel } from 'src/app/shared/interface/core.interface';

export interface ICurrencyModel extends IPaginateModel {
  data: ICurrency[];
}

export interface ICurrency {
  id: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  exchangeRate: number;
  currencySymbolPosition: string;
  isActive: boolean;
  isBaseCurrency: boolean;
  createdAt?: string;
  updatedAt?: string;
}
