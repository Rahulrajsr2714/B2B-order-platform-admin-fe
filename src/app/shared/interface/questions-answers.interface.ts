import { IPaginateModel } from './core.interface';

export interface IQnAModel extends IPaginateModel {
  data: IQuestionAnswers[];
}
export interface IQuestionAnswers {
  id: number;
  answer: string;
  product_id: number;
  product: IProduct;
  store: IStore;
  reaction: string | null;
  question: string;
  total_dislikes: number;
  total_likes: number;
  consumer_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IProduct {
  id: number;
  name: string;
}

export interface IStore {
  id: number;
  store_name: string;
}
