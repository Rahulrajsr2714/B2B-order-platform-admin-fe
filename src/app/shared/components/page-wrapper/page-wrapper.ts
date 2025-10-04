import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LoaderState } from '../../state/loader.state';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-page-wrapper',
  templateUrl: './page-wrapper.html',
  styleUrls: ['./page-wrapper.scss'],
  imports: [Loader, CommonModule, TranslateModule],
})
export class PageWrapper {
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  public readonly title = input<string>(undefined);
  public readonly grid = input<boolean>(true);
  public readonly gridClass = input<string>('col-xxl-8 col-xl-10 m-auto');

  loadingStatus$: Observable<boolean> = inject(Store).select(
    LoaderState.status,
  ) as Observable<boolean>;
}
