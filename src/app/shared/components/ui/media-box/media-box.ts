import { CommonModule } from '@angular/common';
import {
  Component,
  DOCUMENT,
  Input,
  Renderer2,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';

import {
  DeleteModal,
  DeleteModal as DeleteModalComponent_1,
} from '../../../../shared/components/ui/modal/delete-modal/delete-modal';
import { IAttachment, IAttachmentModel } from '../../../../shared/interface/attachment.interface';
import { Params } from '../../../../shared/interface/core.interface';
import { DeleteAttachmentAction, GetAttachmentsAction } from '../../../action/attachment.action';
import { HasPermissionDirective } from '../../../directive/has-permission.directive';
import { AttachmentState } from '../../../state/attachment.state';
import { Loader } from '../../loader/loader';
import { NoData } from '../no-data/no-data';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-media-box',
  templateUrl: './media-box.html',
  styleUrls: ['./media-box.scss'],
  imports: [
    ReactiveFormsModule,
    Loader,
    HasPermissionDirective,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    Pagination,
    NoData,
    DeleteModalComponent_1,
    CommonModule,
    TranslateModule,
  ],
})
export class MediaBox {
  private store = inject(Store);
  private document = inject<Document>(DOCUMENT);
  private renderer = inject(Renderer2);

  attachment$: Observable<IAttachmentModel> = inject(Store).select(AttachmentState.attachment);

  readonly DeleteModal = viewChild<DeleteModal>('deleteModal');

  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() selectedImages: IAttachment[] = [];
  readonly multiple = input<boolean>(false);
  readonly url = input<boolean>(false);
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() loading: boolean = true;
  readonly deleteAction = input<boolean>(true);

  readonly setImage = output<[] | any>();
  readonly setDeleteImage = output<number>();

  public term = new FormControl();
  public filter = {
    search: '',
    field: '',
    sort: '', // current Sorting Order
    page: 1, // current page number
    paginate: 48, // Display per page,
  };
  public totalItems: number = 0;

  constructor() {
    this.attachment$.subscribe(attachment => (this.totalItems = attachment?.total));
    this.getAttachments(this.filter, true);
    this.term.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((data: string) => {
        this.filter.search = data;
        this.getAttachments(this.filter);
      });
  }

  getAttachments(filter: Params, loader?: boolean) {
    this.loading = true;
    this.store.dispatch(new GetAttachmentsAction(filter)).subscribe({
      complete: () => {
        this.loading = false;
      },
    });
    if (!loader) this.renderer.addClass(this.document.body, 'loader-none');
  }

  onMediaChange(event: Event) {
    this.filter.sort = (<HTMLInputElement>event.target).value;
    this.getAttachments(this.filter);
  }

  onActionClicked(action: string, data: IAttachment) {
    if (action == 'delete')
      this.store.dispatch(new DeleteAttachmentAction(data.id!)).subscribe({
        complete: () => {
          this.setDeleteImage.emit(data.id!);
        },
      });
  }

  selectImage(event: Event, attachment: IAttachment, url: boolean) {
    if (this.multiple()) {
      const index = this.selectedImages.indexOf(attachment);
      if ((<HTMLInputElement>event.target).checked) {
        if (index == -1) this.selectedImages.push(attachment);
      } else {
        this.selectedImages = this.selectedImages.filter(
          image => image.id != parseInt((<HTMLInputElement>event.target).value),
        );
      }
    } else {
      this.selectedImages = <any>attachment;
    }

    if (url) {
      this.selectedImages = <any>attachment;
    }
    this.setImage.emit(this.selectedImages);
  }

  setPaginate(data: number) {
    this.filter.page = data;
    this.getAttachments(this.filter);
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }
}
