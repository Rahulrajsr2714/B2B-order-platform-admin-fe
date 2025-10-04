import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  DeleteAllRoleAction,
  DeleteRoleAction,
  GetRolesAction,
} from '../../shared/action/role.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { Params } from '../../shared/interface/core.interface';
import { IRole, IRoleModel } from '../../shared/interface/role.interface';
import { ITableClickedAction, ITableConfig } from '../../shared/interface/table.interface';
import { RoleState } from '../../shared/state/role.state';

@Component({
  selector: 'app-role',
  templateUrl: './role.html',
  styleUrls: ['./role.scss'],
  imports: [PageWrapper, HasPermissionDirective, RouterModule, Table, TranslateModule],
})
export class Role {
  private store = inject(Store);
  private router = inject(Router);

  role$: Observable<IRoleModel> = inject(Store).select(RoleState.role);

  public tableConfig: ITableConfig = {
    columns: [
      { title: 'No.', dataField: 'no', type: 'no' },
      { title: 'name', dataField: 'name', sortable: true, sort_direction: 'desc' },
      {
        title: 'created_at',
        dataField: 'created_at',
        type: 'date',
        sortable: true,
        sort_direction: 'desc',
      },
    ],
    rowActions: [
      { label: 'Edit', actionToPerform: 'edit', icon: 'ri-pencil-line', permission: 'role.edit' },
      {
        label: 'Delete',
        actionToPerform: 'delete',
        icon: 'ri-delete-bin-line',
        permission: 'role.destroy',
      },
    ],
    data: [] as IRole[],
    total: 0,
  };

  ngOnInit() {
    this.role$.subscribe(role => {
      this.tableConfig.data = role ? role?.data : [];
      this.tableConfig.total = role ? role?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetRolesAction(data!));
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    else if (action.actionToPerform == 'delete') this.delete(action.data);
    else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data);
  }

  edit(data: IRole) {
    void this.router.navigateByUrl(`/role/edit/${data.id}`);
  }

  delete(data: IRole) {
    this.store.dispatch(new DeleteRoleAction(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllRoleAction(ids));
  }
}
