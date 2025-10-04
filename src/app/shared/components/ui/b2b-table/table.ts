import { CommonModule, DatePipe, NgClass } from '@angular/common';
import {
  Component,
  DOCUMENT,
  inject,
  Input,
  input,
  output,
  Renderer2,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbInputDatepicker,
  NgbRating,
  NgbRatingConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Params } from '../../../interface/core.interface';
import { CurrencySymbolPipe } from '../../../pipe/currency-symbol.pipe';
import { LoaderState } from '../../../state/loader.state';
import { ConfirmationModal } from '../modal/confirmation-modal/confirmation-modal';
import { DeleteModal } from '../modal/delete-modal/delete-modal';
import { Pagination } from '../pagination/pagination';
import {
  ITableClickedAction,
  ITableColumn,
  ITableConfig,
} from './model/b2b-table.interface';

@Component({
  selector: 'app-b2b-table',
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
  imports: [
    ReactiveFormsModule,
    NgbInputDatepicker,
    NgClass,
    NgbRating,
    Pagination,
    DeleteModal,
    ConfirmationModal,
    CommonModule,
    DatePipe,
    TranslateModule,
    CurrencySymbolPipe,
  ],
})
export class B2BTable {
  private document = inject<Document>(DOCUMENT);
  private renderer = inject(Renderer2);
  private calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  loadingStatus$: Observable<boolean | undefined> = inject(Store).select(
    LoaderState.status,
  );

  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() tableConfig: ITableConfig;
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() hasCheckbox: boolean = false;
  readonly hasDuplicate = input<boolean>(false);
  readonly topbar = input<boolean>(true);
  readonly pagination = input<boolean>(true);
  readonly loading = input<boolean>(true);
  readonly dateRange = input<boolean>(false);

  readonly tableChanged = output<Params>();
  readonly action = output<ITableClickedAction>();
  readonly rowClicked = output<any>();
  readonly selectedItems = output<string[]>();

  readonly DeleteModal = viewChild<DeleteModal>('deleteModal');
  readonly ConfirmationModal =
    viewChild<ConfirmationModal>('confirmationModal');

  public term = new FormControl();
  public rows = [10, 30, 50];
  public tableData: Params = {
    search: '',
    field: '',
    sort: 'ASC', // current Sorting Order
    page: 1, // current page number
    paginate: 10, // Display per page,
  };

  public selected: string[] = [];
  public permissions: string[] = [];

  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;

  constructor() {
    const config = inject(NgbRatingConfig);

    config.max = 5; // customize default values of ratings used by this component tree
    config.readonly = true;

    this.term.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((data: string) => {
        this.onChangeTable(data, 'search');
      });
  }

  ngOnInit() {
    this.tableChanged.emit(this.tableData);
    this.loadingStatus$.subscribe((res) => {
      if (res == false) {
        this.selected = [];
      }
    });
  }

  onChangeTable(data: ITableColumn | any, type: string) {
    if (type === 'sort' && data && data.sortable !== false) {
      switch (data.sort_direction) {
        case 'asc':
          data.sort_direction = 'desc';
          break;
        case 'desc':
          data.sort_direction = 'asc';
          break;
        default:
          data.sort_direction = 'desc';
          break;
      }
      this.tableData['field'] = data.dataField!;
      this.tableData['sort'] =
        this.tableData['sort'] === 'desc' ? 'asc' : 'desc';
    } else if (type === 'paginate') {
      this.tableData['paginate'] = (<HTMLInputElement>data.target)?.value;
    } else if (type === 'page') {
      this.tableData['page'] = data;
    } else if (type === 'search') {
      this.tableData['search'] = data;
    } else if ((type = 'daterange')) {
      if (data) {
        this.tableData['start_date'] = data.start_date;
        this.tableData['end_date'] = data.end_date;
      } else {
        delete this.tableData['start_date'];
        delete this.tableData['end_date'];
      }
    }
    this.renderer.addClass(this.document.body, 'loader-none');
    this.tableChanged.emit(this.tableData);
  }

  onActionClicked(actionType: string, rowData: any, value?: number) {
    console.warn(actionType, rowData, value);
    this.renderer.addClass(this.document.body, 'loader-none');
    rowData[actionType] = value;
    this.action.emit({ actionToPerform: actionType, data: rowData });
  }

  onRowClicked(rowData: any): void {
    this.rowClicked.emit(rowData);
  }

  checkUncheckAll(event: Event) {
    this.tableConfig?.data!.forEach((item: any) => {
      if (item.system_reserve != '1') {
        item.isChecked = (<HTMLInputElement>event?.target)?.checked;
        this.setSelectedItem(
          (<HTMLInputElement>event?.target)?.checked,
          item?.id,
        );
      }
    });
  }

  onItemChecked(event: Event) {
    this.setSelectedItem(
      (<HTMLInputElement>event.target)?.checked,
      (<HTMLInputElement>event.target)?.value,
    );
  }

  setSelectedItem(checked: Boolean, value: string) {
    const index = this.selected.indexOf(value);
    if (checked) {
      if (index == -1) this.selected.push(value);
    } else {
      this.selected = this.selected.filter((id) => id != value);
    }
    this.selectedItems.emit(this.selected);
  }

  get deleteButtonStatus() {
    let status = false;
    this.tableConfig?.data?.filter((data: any) => {
      if (this.selected.includes(data?.id)) {
        const permission = this.tableConfig?.rowActions?.find(
          (action) => action.actionToPerform == 'delete',
        )?.permission as string;
        if (permission && this.permissions?.includes(permission)) {
          status = true;
        }
      }
    });
    return status;
  }

  get duplicateButtonStatus() {
    let status = false;
    this.tableConfig?.data?.filter((data: any) => {
      if (this.selected.includes(data?.id)) {
        const permission = this.tableConfig?.rowActions?.find(
          (action) => action.actionToPerform == 'edit',
        )?.permission as string;
        if (permission && this.permissions?.includes(permission)) {
          status = true;
        }
      }
    });
    return status;
  }

  // For Date Picker

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    let params = {
      start_date: `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`,
      end_date: `${this.toDate?.year}-${this.toDate?.month}-${this.toDate?.day}`,
    };
    this.onChangeTable(params, 'daterange');
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }

  clearDateRange() {
    this.fromDate = null;
    this.toDate = null;
    let params = null;
    this.onChangeTable(params, 'daterange');
  }
}
