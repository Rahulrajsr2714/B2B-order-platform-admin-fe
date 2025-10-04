import { CommonModule } from '@angular/common';
import { Component, TemplateRef, inject, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { Observable } from 'rxjs';

import {
  CreateShippingAction,
  UpdateShippingAction,
} from '../../../../shared/action/shipping.action';
import { Button } from '../../../../shared/components/ui/button/button';
import { IShipping } from '../../../../shared/interface/shipping.interface';
import { CountryState } from '../../../../shared/state/country.state';

@Component({
  selector: 'app-shipping-country-modal',
  templateUrl: './shipping-country-modal.html',
  styleUrls: ['./shipping-country-modal.scss'],
  imports: [ReactiveFormsModule, Select2Module, Button, CommonModule, TranslateModule],
})
export class ShippingCountryModal {
  private modalService = inject(NgbModal);
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);

  countries$: Observable<Select2Data> = inject(Store).select(CountryState.countries);

  public closeResult: string;
  public modalOpen: boolean = false;
  public form: FormGroup;
  public data: IShipping | null;

  readonly CountryShippingModal = viewChild<TemplateRef<string>>('countryShippingModal');

  constructor() {
    this.form = this.formBuilder.group({
      country_id: new FormControl('', [Validators.required]),
      status: new FormControl(1),
    });
  }

  async openModal(data?: IShipping) {
    this.modalOpen = true;
    this.data = null;
    if (data) {
      this.data = data;
      this.form.patchValue({ country_id: data?.country_id, status: data?.status });
    }
    this.modalService
      .open(this.CountryShippingModal(), {
        ariaLabelledBy: 'Shipping-country-Modal',
        centered: true,
        windowClass: 'theme-modal',
      })
      .result.then(
        result => {
          `Result ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateShippingAction(this.form.value);
    if (this.data) {
      action = new UpdateShippingAction(this.form.value, this.data.id);
    }
    if (this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => {
          this.form.controls['country_id'].reset();
          this.modalService.dismissAll();
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}
