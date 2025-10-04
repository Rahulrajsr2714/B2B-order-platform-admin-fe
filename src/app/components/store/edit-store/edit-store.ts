import { Component } from '@angular/core';

import { PageWrapper } from '../../../shared/components/page-wrapper/page-wrapper';
import { FormStore } from '../form-store/form-store';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.html',
  styleUrls: ['./edit-store.scss'],
  imports: [PageWrapper, FormStore],
})
export class EditStore {}
