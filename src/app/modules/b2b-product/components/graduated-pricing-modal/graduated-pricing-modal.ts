import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'src/app/shared/components/ui/button/button';
import { DeleteModal } from 'src/app/shared/components/ui/modal/delete-modal/delete-modal';

import { IB2bProduct } from '../../models/b2b-product.interface';
import {
  IGraduatedPrice,
  IGraduatedPricingFormData,
} from '../../models/graduated-pricing.interface';
import { GraduatedPricingService } from '../../service/graduated-pricing.service';

@Component({
  selector: 'app-graduated-pricing-modal',
  templateUrl: './graduated-pricing-modal.html',
  styleUrls: ['./graduated-pricing-modal.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    Button,
    DeleteModal,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimize change detection
})
export class GraduatedPricingModal {
  // Dependency injection using modern inject() pattern
  private readonly modalService = inject(NgbModal);
  private readonly fb = inject(FormBuilder);
  private readonly graduatedPricingService = inject(GraduatedPricingService);
  private readonly destroyRef = inject(DestroyRef); // Auto-cleanup for subscriptions

  // Component state
  public graduatedPricingForm!: FormGroup;
  public currentProduct!: IB2bProduct;
  public graduatedPricings: IGraduatedPrice[] = [];

  // Template references and outputs
  readonly graduatedPricingModal = viewChild<TemplateRef<HTMLElement>>(
    'graduatedPricingModal',
  );
  readonly saveGraduatedPricing = output<IGraduatedPricingFormData>();
  readonly deleteModal = viewChild<DeleteModal>('deleteModal');

  constructor() {
    this.initializeForm();
  }

  /**
   * Fetches graduated pricing data for the current product
   * Uses takeUntilDestroyed for automatic cleanup
   */
  private getPricesForProduct(): void {
    this.graduatedPricingService
      .getGraduatedPricing(this.currentProduct.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resp) => {
          this.graduatedPricings = resp;
          this.initializeFormWithData();
        },
      });
  }

  /**
   * Initializes the reactive form with default structure
   */
  private initializeForm(): void {
    this.graduatedPricingForm = this.fb.group({
      productId: ['', Validators.required],
      productName: [{ value: '', disabled: true }],
      prices: this.fb.array([]),
    });
  }

  get pricesArray(): FormArray {
    return this.graduatedPricingForm.get('prices') as FormArray;
  }

  /**
   * Creates a form group for a single price tier
   * @param price Optional existing price data to populate the form
   */
  createPriceFormGroup(price?: IGraduatedPrice): FormGroup {
    return this.fb.group({
      id: [price?.id || undefined],
      minQuantity: [
        price?.minQuantity || 1,
        [Validators.required, Validators.min(1)],
      ],
      maxQuantity: [price?.maxQuantity || null],
      unitCode: [price?.unitCode || 'PCE', Validators.required],
      unitPrice: [
        price?.unitPrice || 0,
        [Validators.required, Validators.min(0.01)],
      ],
      isActive: [price?.isActive !== undefined ? price.isActive : true],
    });
  }

  /**
   * Adds a new empty price tier to the form array
   */
  addPriceTier(): void {
    const priceGroup = this.createPriceFormGroup();
    this.pricesArray.push(priceGroup);
  }

  /**
   * Removes a price tier from the form array
   * If the tier has an ID, prompts for confirmation before deletion
   */
  async removePriceTier(index: number, id: string): Promise<void> {
    if (this.pricesArray.length > 1) {
      if (!id) {
        this.pricesArray.removeAt(index);
        return;
      }
      await this.deleteModal()?.openModal('deleteGp', { index, id });
    }
  }

  /**
   * Opens the modal and initializes it with product data
   * @param product The product for which to manage graduated pricing
   */
  async openModal(product: IB2bProduct): Promise<void> {
    this.currentProduct = product;
    this.getPricesForProduct();

    this.initializeFormWithData();

    this.modalService.open(this.graduatedPricingModal(), {
      ariaLabelledBy: 'graduated-pricing-modal',
      centered: true,
      size: 'xl',
      windowClass: 'theme-modal',
      backdrop: 'static',
    });
  }

  /**
   * Initializes the form with current product and pricing data
   */
  initializeFormWithData(): void {
    // Reset form and populate with product data
    this.initializeForm();
    this.graduatedPricingForm.patchValue({
      productId: this.currentProduct.id,
      productName: this.currentProduct.productName,
    });

    // Clear existing price tiers
    while (this.pricesArray.length !== 0) {
      this.pricesArray.removeAt(0);
    }

    // Add existing graduated prices or create initial tier
    if (this.graduatedPricings?.length > 0) {
      this.graduatedPricings.forEach((price) => {
        const priceGroup = this.createPriceFormGroup(price);
        this.pricesArray.push(priceGroup);
      });
    } else {
      // Add initial price tier
      this.addPriceTier();
    }
  }

  /**
   * Saves all price tiers
   * Currently not being used - individual save/update is used instead
   */
  onSave(): void {
    if (this.graduatedPricingForm.valid) {
      const formData: IGraduatedPricingFormData = {
        productId: this.graduatedPricingForm.get('productId')?.value,
        productName: this.graduatedPricingForm.get('productName')?.value,
        prices: this.pricesArray.value,
      };
      const submitValue = this.pricesArray.value.map(
        (value: IGraduatedPrice) => {
          return {
            productId: this.currentProduct.id,
            minQuantity: value.minQuantity,
            maxQuantity: value.maxQuantity,
            unitCode: value.unitCode,
            unitPrice: value.unitPrice,
            priceType: 'BUY',
            isActive: value.isActive,
          };
        },
      );

      this.graduatedPricingService
        .bulkCreateGraduatedPricing(submitValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.saveGraduatedPricing.emit(formData);
            this.modalService.dismissAll();
          },
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.graduatedPricingForm.markAllAsTouched();
    }
  }

  /**
   * Saves a new price tier
   * @param priceGroup The price data to save
   */
  onSavePrice(priceGroup: IGraduatedPrice): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...priceData } = priceGroup;
    this.graduatedPricingService
      .createGraduatedPricing({
        productId: this.currentProduct.id,
        ...priceData,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.getPricesForProduct();
        },
      });
  }

  /**
   * Updates an existing price tier
   * @param priceGroup The price data to update
   */
  onUpdatePrice(priceGroup: IGraduatedPrice): void {
    this.graduatedPricingService
      .updateGraduatedPricing(priceGroup.id, {
        productId: this.currentProduct.id,
        ...priceGroup,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.getPricesForProduct();
        },
      });
  }

  /**
   * Closes the modal
   */
  onCancel(): void {
    this.modalService.dismissAll();
  }

  /**
   * Validates that max quantity is greater than min quantity
   * @param index The index of the price tier in the form array
   */
  validateQuantityRange(index: number): void {
    const priceGroup = this.pricesArray.at(index);
    const minQuantity = priceGroup.get('minQuantity')?.value;
    const maxQuantity = priceGroup.get('maxQuantity')?.value;

    if (minQuantity && maxQuantity && maxQuantity <= minQuantity) {
      priceGroup.get('maxQuantity')?.setErrors({ invalidRange: true });
    } else {
      const maxQuantityControl = priceGroup.get('maxQuantity');
      if (maxQuantityControl?.errors?.['invalidRange']) {
        delete maxQuantityControl.errors['invalidRange'];
        if (Object.keys(maxQuantityControl.errors).length === 0) {
          maxQuantityControl.setErrors(null);
        }
      }
    }
  }

  /**
   * Gets user-friendly error messages for form validation
   * @param controlName The name of the form control
   * @param index Optional index for form array controls
   */
  getErrorMessage(controlName: string, index?: number): string {
    let control;
    if (index !== undefined) {
      control = this.pricesArray.at(index).get(controlName);
    } else {
      control = this.graduatedPricingForm.get(controlName);
    }

    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        const fieldName = this.getFieldDisplayName(controlName);
        return `${fieldName} is required`;
      }
      if (control.errors['min']) {
        const fieldName = this.getFieldDisplayName(controlName);
        return `${fieldName} must be greater than ${control.errors['min'].min}`;
      }
      if (control.errors['invalidRange']) {
        return 'Max quantity must be greater than min quantity';
      }
    }
    return '';
  }

  /**
   * Maps control names to user-friendly display names
   * @param controlName The control name to map
   */
  private getFieldDisplayName(controlName: string): string {
    const fieldNames: Record<string, string> = {
      minQuantity: 'Min Quantity',
      maxQuantity: 'Max Quantity',
      unitPrice: 'Unit Price',
      unitCode: 'Unit Code',
      priceType: 'Price Type',
    };
    return fieldNames[controlName] || controlName;
  }

  /**
   * Handles deletion of a graduated pricing tier
   * @param actionToPerform The action to perform
   * @param data The data containing the ID of the tier to delete
   */
  onDeleteGp(
    actionToPerform: string,
    data: { id: string; index: number },
  ): void {
    this.graduatedPricingService
      .deleteGraduatedPricing(data.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.getPricesForProduct();
        },
      });
  }
}
