import { IPaginateModel } from 'src/app/shared/interface/core.interface';

export interface ICategoryModel extends IPaginateModel {
  data: ICategory[];
}

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
  pictureUrl: string;
  pictureKey: string;
  thumbnailUrl: string;
  thumbnailKey: string;
  displayOrder: number;
}
