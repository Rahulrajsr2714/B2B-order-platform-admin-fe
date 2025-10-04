import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { IValues } from '../../interface/setting.interface';
import { SettingState } from '../../state/setting.state';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  imports: [CommonModule],
})
export class Footer {
  setting$: Observable<IValues | null> = inject(Store).select(SettingState.setting);
}
