import { File } from 'buffer';
import { IPaginateModel } from 'src/app/shared/interface/core.interface';

export interface IBrandModel extends IPaginateModel {
  data: IBrand[];
}

export interface IBrand {
  id: string;
  brandCode: string;
  brandName: string;
  description: string | null;
  customSlug: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  brandLogoUrl: string | null;
  brandLogoKey: string | null;
  brandThumbnailUrl: string | null;
  brandThumbnailKey: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  logo?: File;
}
