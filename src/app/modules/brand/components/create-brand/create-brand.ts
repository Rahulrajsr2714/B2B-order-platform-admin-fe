import { Component } from '@angular/core';

import { PageWrapper } from '../../../../shared/components/page-wrapper/page-wrapper';
import { FormBrand } from '../form-brand/form-brand';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.html',
  styleUrls: ['./create-brand.scss'],
  imports: [PageWrapper, FormBrand],
})
export class CreateBrand {}
