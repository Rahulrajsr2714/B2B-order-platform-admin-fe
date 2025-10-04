import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { FormCategory } from './form-category/form-category';
import { Tree } from './tree/tree';
import { GetCategoriesAction } from '../../shared/action/category.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { ICategoryModel } from '../../shared/interface/category.interface';
import { CategoryState } from '../../shared/state/category.state';

@Component({
  selector: 'app-category',
  templateUrl: './category.html',
  styleUrls: ['./category.scss'],
  imports: [
    PageWrapper,
    HasPermissionDirective,
    RouterModule,
    Tree,
    FormCategory,
    CommonModule,
    TranslateModule,
  ],
})
export class Category {
  private store = inject(Store);

  category$: Observable<ICategoryModel> = inject(Store).select(
    CategoryState.category,
  ) as Observable<ICategoryModel>;

  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  readonly type = input<string>('create');
  readonly categoryType = input<string | null>('product');

  ngOnInit(): void {
    this.store.dispatch(new GetCategoriesAction({ type: this.categoryType() }));
  }
}
