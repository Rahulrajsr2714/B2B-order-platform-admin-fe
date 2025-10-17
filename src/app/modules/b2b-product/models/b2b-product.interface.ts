import { IPaginateModel } from 'src/app/shared/interface/core.interface';

import { IBrand } from '../../brand/models/brand.interface';

export interface ICategory {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryCode: string;
  categoryName: string;
  description: string;
  customSlug: string;
  metaTitle: string;
  metaDescription: string;
  pictureUrl: string | null;
  pictureKey: string | null;
  thumbnailUrl: string | null;
  thumbnailKey: string | null;
  displayOrder: number;
}

export interface IProductCategory {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productId: string;
  categoryId: string;
  isPrimary: boolean;
  category: ICategory;
}

export interface IProductImage {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productId: string;
  imageUrl: string;
  imageKey: string;
  thumbnailUrl: string;
  thumbnailKey: string;
  altText: string;
  format: string;
  imageType: string;
  galleryIndex: number;
  displayOrder: number;
}

export interface IB2bProductModel extends IPaginateModel {
  data: IB2bProduct[];
}

export interface IB2bProduct {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productCode: string;
  productName: string;
  commercialName: string;
  legalName: string;
  shortDescription: string;
  description: string;
  summary: string;
  customSlug: string;
  metaTitle: string;
  metaDescription: string;
  brandId: string;
  productType: string;
  eanCu: string;
  barcodeCu: string;
  consumerUnitSymbol: string;
  netWeightCu: string;
  grossWeightCu: string;
  lengthCu: string;
  widthCu: string;
  heightCu: string;
  eanSu: string;
  barcodeSu: string;
  salesUnitSymbol: string;
  piecesPerSu: number;
  grossWeightSu: string;
  lengthSu: string;
  widthSu: string;
  heightSu: string;
  dimensions?: Record<string, unknown> | null;
  weightUnit: string;
  dimensionUnit: string;
  layersPerPallet: number;
  salesUnitsPerPallet: number;
  countryOfOriginCode: string;
  countryOfOriginName: string;
  ingredients: string;
  energyKj: number;
  energyKcal: number;
  fat: string;
  saturatedFat: string;
  carbohydrates: string;
  sugars: string;
  proteins: string;
  salt: string;
  isHalal: boolean;
  isKosher: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isOrganic: boolean;
  isBiological: boolean;
  isNatural: boolean;
  isGlutenFree: boolean;
  isAlcoholFree: boolean;
  isGmoFree: boolean;
  hasArtificialAdditives: boolean;
  spicinessLevel: string;
  spicinessDescription: string;
  spicinessIconUrl: string | null;
  isCoolFresh: boolean;
  isFrozen: boolean;
  bestBeforeDate: string;
  expiryDate: string;
  stockLevel: number;
  stockStatus: string;
  isStockRounded: boolean;
  reorderLevel: number;
  reorderQuantity: number;
  isPurchasable: boolean;
  isConfigurable: boolean;
  isTrending: boolean;
  isOnOffer: boolean;
  isRecipe: boolean;
  promotionLabel: string;
  brand: IBrand;
  categories: IProductCategory[];
  images: IProductImage[];
  pricing: Record<string, unknown>[];
  graduatedPrices: Record<string, unknown>[];
}
