import { CommonModule } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LogoutAction } from '../../.././../../shared/action/auth.action';
import { IAccountUser } from '../../.././../../shared/interface/account.interface';
import { AccountState } from '../../.././../../shared/state/account.state';
import { ConfirmationModal } from '../../../ui/modal/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  imports: [RouterModule, ConfirmationModal, CommonModule, TranslateModule],
})
export class Profile {
  private store = inject(Store);

  user$: Observable<IAccountUser> = inject(Store).select(AccountState.user);

  readonly ConfirmationModal = viewChild<ConfirmationModal>('confirmationModal');

  public active: boolean = false;

  clickHeaderOnMobile() {
    this.active = !this.active;
  }

  logout() {
    this.store.dispatch(new LogoutAction());
  }
}
