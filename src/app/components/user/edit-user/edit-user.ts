import { Component } from '@angular/core';

import { PageWrapper } from '../../../shared/components/page-wrapper/page-wrapper';
import { FormUser } from '../form-user/form-user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.scss'],
  imports: [PageWrapper, FormUser],
})
export class EditUser {}
