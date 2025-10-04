import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, SimpleChanges, inject, output } from '@angular/core';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GetRoleModulesAction } from '../../../shared/action/role.action';
import { IModule } from '../../../shared/interface/role.interface';
import { RoleState } from '../../../shared/state/role.state';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.html',
  styleUrls: ['./permissions.scss'],
  imports: [CommonModule, TitleCasePipe],
})
export class Permissions {
  private store = inject(Store);

  modules$: Observable<IModule[]> = inject(Store).select(RoleState.roleModules);

  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() selectedPermission: number[] = [];

  readonly setPermissions = output<number[]>();

  constructor() {
    this.store.dispatch(new GetRoleModulesAction());
  }

  ngOnChanges(changes: SimpleChanges) {
    let ids = changes['selectedPermission']?.currentValue;
    this.modules$.subscribe(modules => {
      modules?.map(item => {
        item.module_permissions.map(permission => {
          permission.isChecked = ids.includes(permission.id);
        });
      });
      modules?.filter(module => {
        this.updateCheckBoxStatus(module);
      });
    });
  }

  checkUncheckAll(event: Event, module: IModule) {
    module.module_permissions.forEach(item => {
      item.isChecked = (<HTMLInputElement>event.target).checked;
      this.addPermission((<HTMLInputElement>event.target).checked, item?.id, module);
    });
  }

  checkIndex(event: Event, module: IModule) {
    module.module_permissions.forEach(item => {
      item.isChecked = false;
      this.addPermission(false, item?.id, module);
    });
  }

  onPermissionChecked(event: Event, module: IModule) {
    module.module_permissions.forEach(item => {
      item.isChecked = false;
      if (item.name == 'index') {
        item.isChecked = !item.isChecked ? true : false;
        this.addPermission(true, +item.id, module);
      }
      this.addPermission(
        (<HTMLInputElement>event.target)?.checked,
        +(<HTMLInputElement>event?.target)?.value,
        module,
      );
    });
  }

  addPermission(checked: Boolean, value: number, module: IModule) {
    const index = this.selectedPermission.indexOf(Number(value));
    if (checked) {
      if (index == -1) this.selectedPermission.push(Number(value));
    } else {
      this.selectedPermission = this.selectedPermission.filter(id => id != Number(value));
    }
    this.setPermissions.emit(this.selectedPermission);
    this.updateCheckBoxStatus(module);
  }

  updateCheckBoxStatus(module: IModule) {
    let count = 0;
    module.module_permissions.filter(permission => {
      if (this.selectedPermission.includes(permission.id!)) {
        count++;
      }
      if (module.module_permissions.length <= count) module.isChecked = true;
      else module.isChecked = false;
    });
  }
}
