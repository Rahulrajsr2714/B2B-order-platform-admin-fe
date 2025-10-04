import { Params } from '../interface/core.interface';

export class GetAttachmentsAction {
  static readonly type = '[IAttachment] Get';
  constructor(public payload?: Params) {}
}

export class CreateAttachmentAction {
  static readonly type = '[IAttachment] Create';
  constructor(public payload: File[]) {}
}

export class DeleteAttachmentAction {
  static readonly type = '[IAttachment] Delete';
  constructor(public id: number) {}
}

export class DeleteAllAttachmentAction {
  static readonly type = '[IAttachment] Delete All';
  constructor(public ids: number[]) {}
}
