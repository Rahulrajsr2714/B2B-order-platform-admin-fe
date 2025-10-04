import { Component, inject, viewChild } from '@angular/core';
import { Params, Router } from '@angular/router';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AnswersModal } from './answers-modal/answers-modal';
import {
  DeleteAllQuestionAnswersAction,
  DeleteQuestionAnswersAction,
  GetQuestionAnswersAction,
} from '../../shared/action/questions-answers.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { IQnAModel, IQuestionAnswers } from '../../shared/interface/questions-answers.interface';
import { IStores } from '../../shared/interface/store.interface';
import { ITableClickedAction, ITableConfig } from '../../shared/interface/table.interface';
import { QuestionAnswersState } from '../../shared/state/questions-answers.state';

@Component({
  selector: 'app-questions-answers',
  templateUrl: './questions-answers.html',
  styleUrls: ['./questions-answers.scss'],
  imports: [PageWrapper, Table, AnswersModal],
})
export class QuestionsAnswers {
  private store = inject(Store);
  router = inject(Router);

  questionAnswers$: Observable<IQnAModel> = inject(Store).select(
    QuestionAnswersState.questionAnswers,
  );

  readonly AnswersModal = viewChild<AnswersModal>('answersModal');

  public tableConfig: ITableConfig = {
    columns: [
      { title: 'No.', dataField: 'no', type: 'no' },
      { title: 'Question', dataField: 'question' },
      {
        title: 'created_at',
        dataField: 'created_at',
        type: 'date',
        sortable: true,
        sort_direction: 'desc',
      },
    ],
    rowActions: [
      { label: 'Edit', actionToPerform: 'edit', icon: 'ri-pencil-line', permission: 'store.edit' },
      {
        label: 'Delete',
        actionToPerform: 'delete',
        icon: 'ri-delete-bin-line',
        permission: 'store.destroy',
      },
    ],
    data: [] as IQuestionAnswers[],
    total: 0,
  };

  ngOnInit() {
    this.questionAnswers$.subscribe(questionAnswers => {
      this.tableConfig.data = questionAnswers.data ? questionAnswers.data : [];
      this.tableConfig.total = questionAnswers?.total ? questionAnswers?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetQuestionAnswersAction(data!));
  }

  onActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') void this.AnswersModal().openModal(action.data);
    else if (action.actionToPerform == 'delete') this.delete(action.data);
    else if (action.actionToPerform == 'deleteAll') this.deleteAll(action.data);
  }

  delete(data: IStores) {
    this.store.dispatch(new DeleteQuestionAnswersAction(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllQuestionAnswersAction(ids));
  }
}
