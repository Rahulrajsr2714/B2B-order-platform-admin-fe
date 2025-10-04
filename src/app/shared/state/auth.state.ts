import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import { AccountClearAction } from '../action/account.action';
import {
  AuthClearAction,
  ForgotPassWordAction,
  LoginAction,
  LogoutAction,
  UpdatePasswordActionAction,
  VerifyEmailOtpAction,
} from '../action/auth.action';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export interface AuthStateModel {
  email: string;
  token: string | number;
  access_token: string | null;
  permissions: [];
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    email: '',
    token: '',
    access_token: '',
    permissions: [],
  },
})
@Injectable()
export class AuthState {
  private store = inject(Store);
  router = inject(Router);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    // Pre Fake Login (if you are using ap
    ctx.patchState({
      email: 'admin@example.com',
      token: '',
      access_token: '135|laravel_sanctum_BrxRCMTABu7vFDsa1CHnkKCkjKtYPcBHMguiUAha319c7ede',
    });
  }

  @Selector()
  static accessToken(state: AuthStateModel) {
    return state.access_token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return !!state.access_token;
  }

  @Selector()
  static email(state: AuthStateModel) {
    return state.email;
  }

  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }

  @Action(LoginAction)
  login(_ctx: StateContext<AuthStateModel>, _action: LoginAction) {
    // Login Logic Here
  }

  @Action(ForgotPassWordAction)
  forgotPassword(_ctx: StateContext<AuthStateModel>, _action: ForgotPassWordAction) {
    // Forgot Password Logic Here
  }

  @Action(VerifyEmailOtpAction)
  verifyEmail(_ctx: StateContext<AuthStateModel>, _action: VerifyEmailOtpAction) {
    // Verify Email Logic Here
  }

  @Action(UpdatePasswordActionAction)
  updatePassword(_ctx: StateContext<AuthStateModel>, _action: UpdatePasswordActionAction) {
    // Update Password Logic Here
  }

  @Action(LogoutAction)
  logout(_ctx: StateContext<AuthStateModel>) {
    // Logout Logic Here
  }

  @Action(AuthClearAction)
  authClear(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      email: '',
      token: '',
      access_token: null,
      permissions: [],
    });
    this.store.dispatch(new AccountClearAction());
  }
}
