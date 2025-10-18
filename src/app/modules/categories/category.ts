import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Observable } from 'rxjs';

import { FormCategory } from './components/form-category/form-category';
import { Tree } from './components/tree/tree';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { CategoryService } from './service/category.service';
import { ICategory } from './models/category.interface';

@Component({
  selector: 'app-category',
  templateUrl: './category.html',
  styleUrls: ['./category.scss'],
  imports: [PageWrapper, RouterModule, Tree, FormCategory, CommonModule],
})
export class Category {
  private readonly categoryService = inject(CategoryService);
  allCategory: ICategory[] = [];
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  readonly type = input<string>('create');
  readonly categoryType = input<string | null>('product');

  ngOnInit(): void {
    this.categoryService.getAllCategoryAsList().subscribe({
      next: (resp) => {
        console.log(resp);
        this.allCategory = resp;
      },
    });
  }
}
