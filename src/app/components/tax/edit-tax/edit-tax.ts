import { Component } from '@angular/core';

import { PageWrapper } from '../../../shared/components/page-wrapper/page-wrapper';
import { FormTax } from '../form-tax/form-tax';

@Component({
  selector: 'app-edit-tax',
  templateUrl: './edit-tax.html',
  styleUrls: ['./edit-tax.scss'],
  imports: [PageWrapper, FormTax],
})
export class EditTax {}
