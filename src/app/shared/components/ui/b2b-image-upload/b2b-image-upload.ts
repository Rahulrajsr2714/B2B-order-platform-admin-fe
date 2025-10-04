import { Component, Input, viewChild, output, input } from '@angular/core';

import {
  MediaModal,
  MediaModal as MediaModalComponent_1,
} from '../../ui/modal/media-modal/media-modal';

interface IAttachment {
  id: number;
  original_url: string;
  file?: File;
}

@Component({
  selector: 'app-b2b-image-upload',
  templateUrl: './b2b-image-upload.html',
  styleUrls: ['./b2b-image-upload.scss'],
  imports: [MediaModalComponent_1],
})
export class B2BImageUpload {
  readonly MediaModal = viewChild<MediaModal>('mediaModal');

  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() images: IAttachment[] = [];
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() image: IAttachment | null;
  readonly id = input<string>(undefined);
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() imageUrl: string | null;
  readonly url = input<boolean>(false);
  readonly multipleImage = input<boolean>(false);
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() helpText: string;

  async onFileSelected(event: Event) {
    console.warn('onFileSelected', event);
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    if (this.multipleImage()) {
      // Handle multiple files
      const fileArray: IAttachment[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const attachment = await this.createAttachmentFromFile(file);
          fileArray.push(attachment);
        }
      }

      this.images = [...this.images, ...fileArray];
      this.showImages = this.images;
      this.selectedFiles.emit(this.images);
    } else {
      // Handle single file
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        const attachment = await this.createAttachmentFromFile(file);

        if (this.url()) {
          this.imageUrl = attachment.original_url;
          this.showImageUrl = attachment.original_url;
          this.selectedFiles.emit(this.imageUrl);
        } else {
          this.image = attachment;
          this.showImage = attachment;
          this.selectedFiles.emit(this.image);
        }
      }
    }
  }

  private async createAttachmentFromFile(file: File): Promise<IAttachment> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const attachment: IAttachment = {
          id: Date.now(), // Generate temporary id
          original_url: (e.target?.result as string) || '',
          file: file, // Keep the file reference for actual upload
        };
        resolve(attachment);
      };
      reader.readAsDataURL(file);
    });
  }

  readonly selectedFiles = output<
    IAttachment | IAttachment[] | string | null
  >();

  public showImages: IAttachment[] = [];
  public showImage: IAttachment | null;
  public showImageUrl: String | null;

  ngOnChanges() {
    this.showImage = this.image;
    this.showImages = this.images;
    this.showImageUrl = this.imageUrl;
  }

  selectImage(data: IAttachment, url: boolean) {
    if (Array.isArray(data)) {
      this.images = data;
      this.showImages = data;
    } else if (url) {
      this.imageUrl = data.original_url;
      this.showImageUrl = data.original_url;
    } else {
      this.image = data;
      this.showImage = data;
    }
    if (this.imageUrl) {
      this.selectedFiles.emit(this.imageUrl);
    } else {
      this.selectedFiles.emit(this.images.length ? this.images : this.image);
    }
  }

  remove(index: number, type: string) {
    if (type == 'multiple' && Array.isArray(this.images)) {
      this.images.splice(index, 1);
      this.showImages = this.images;
    } else if (type == 'single_image_url') {
      this.imageUrl = null;
      this.showImageUrl = null;
      this.image = null;
    } else {
      this.image = null;
      this.showImage = null;
    }
    this.selectedFiles.emit(this.images.length ? this.images : this.image);
  }
}
