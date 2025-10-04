import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LoaderState } from '../../../state/loader.state';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
  imports: [CommonModule],
})
export class Button {
  readonly class = input<string>('btn btn-theme ms-auto mt-4');
  readonly classData = input<string>('btn btn-theme ms-auto mt-4');
  readonly iconClass = input<string | null>(undefined);
  readonly id = input<string>(undefined);
  readonly label = input<string>('Submit');
  readonly type = input<string>('submit');
  readonly spinner = input<boolean>(true);
  readonly disabled = input<boolean>(false);

  public buttonId: string | null;

  spinnerStatus$: Observable<boolean> = inject(Store).select(
    LoaderState.buttonSpinner,
  ) as Observable<boolean>;

  constructor() {
    this.spinnerStatus$.subscribe(res => {
      if (res == false) {
        this.buttonId = null;
      }
    });
  }

  public onClick(id: string): void {
    this.buttonId = id;
  }
}
