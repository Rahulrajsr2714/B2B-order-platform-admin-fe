import { Component } from '@angular/core';

import { PageWrapper } from '../../../../shared/components/page-wrapper/page-wrapper';
import { FormBrand } from '../form-brand/form-brand';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.html',
  styleUrls: ['./edit-brand.scss'],
  imports: [PageWrapper, FormBrand],
})
export class EditBrand {}
