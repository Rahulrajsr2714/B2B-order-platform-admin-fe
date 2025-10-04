import { Component, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';

import { CreateTagAction, EditTagAction, UpdateTagAction } from '../../../shared/action/tag.action';
import { Button } from '../../../shared/components/ui/button/button';
import { FormFields } from '../../../shared/components/ui/form-fields/form-fields';
import { ITag } from '../../../shared/interface/tag.interface';
import { TagState } from '../../../shared/state/tag.state';

@Component({
  selector: 'app-form-tag',
  templateUrl: './form-tag.html',
  styleUrls: ['./form-tag.scss'],
  imports: [ReactiveFormsModule, FormFields, Button, TranslateModule],
})
export class FormTag {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  readonly type = input<string>(undefined);
  readonly tagType = input<string | null>('product');

  public form: FormGroup;
  public tag: ITag | null;

  private destroy$ = new Subject<void>();

  constructor() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(),
      type: new FormControl(this.tagType(), []),
      status: new FormControl(true),
    });
  }

  ngOnChanges() {
    this.form.controls['type'].setValue(this.tagType());
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
          if (!params['id']) return of();
          return this.store
            .dispatch(new EditTagAction(params['id']))
            .pipe(mergeMap(() => this.store.select(TagState.selectedTag)));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(tag => {
        this.tag = tag;
        this.form.patchValue({
          name: this.tag?.name,
          description: this.tag?.description,
          status: this.tag?.status,
        });
      });
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateTagAction(this.form.value);

    if (this.type() == 'edit' && this.tag?.id) {
      action = new UpdateTagAction(this.form.value, this.tag.id);
    }

    if (this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => {
          if (this.tagType() == 'post') void this.router.navigateByUrl('/blog/tag');
          else void this.router.navigateByUrl('/tag');
        },
      });
    }
  }
}
