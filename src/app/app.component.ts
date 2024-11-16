import { CommonModule } from '@angular/common';
import { Component, effect,signal,computed } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

export function tipRequiredValidator(control: AbstractControl): ValidationErrors | null {
  const predefinedValue = control.get('predefinedValue')?.value;
  const tipPercentage = control.get('tipPercentage')?.value;

  if (!predefinedValue && !tipPercentage) {
    return { tipRequired: true };
  }
  return null;
}
@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'tip-calculator';

  customValue = signal(false);
  selectedPredefinedTip = signal<number | null>(null);

  predefinedValues: number[] = [5, 10, 15, 25, 50];

  billForm = new FormGroup({
    billAmount: new FormControl<number | null>(null, [
      Validators.required, Validators.min(1)]),
    tipPercentage: new FormControl<number | null>(null, [Validators.min(0.01)]),
    predefinedValue: new FormControl<number | null>(null),
    peopleQty: new FormControl<number | null>(null, [
      Validators.required, Validators.min(1)]),
  }, { validators: tipRequiredValidator });

  readonly billFormValueSignal = toSignal(this.billForm.valueChanges);

  splitAmount = computed(() => {
    const formValues = this.billFormValueSignal();
    if (!formValues?.billAmount || !formValues?.predefinedValue)
      return 0;
    const tipPercentage = formValues.tipPercentage || formValues.predefinedValue || 0;
    return (formValues.billAmount * tipPercentage) / 100;
  })

  splitPerPerson = computed(() => {
    const formValues = this.billFormValueSignal();
    if (!formValues?.peopleQty || this.splitAmount() === 0) return 0;
    return this.splitAmount() / formValues.peopleQty;
  })

  totalAmount = computed(() => {
    const formValues = this.billFormValueSignal();
    if (!formValues?.peopleQty || !formValues?.billAmount) return 0;
    return (formValues.billAmount / formValues.peopleQty) + this.splitPerPerson();
  })

  totalBill = computed(() => {
    const formValues = this.billFormValueSignal();
    if (!formValues?.billAmount || this.totalAmount() === 0) return 0;
    return (formValues.billAmount + this.totalAmount())
  })
  constructor() {
    effect(() => {
      const formValues = this.billFormValueSignal();
      if (formValues) {
        const predefinedValue = formValues.predefinedValue ?? null;
        this.updatePredefinedTip(predefinedValue);
      }
    });
  }

  updatePredefinedTip(value: number | null) {
    if (this.selectedPredefinedTip() !== value) {
      this.selectedPredefinedTip.set(value);
    }
  }
  onButtonClick(value: number): void {
    this.customValue.set(false);
    this.updatePredefinedTip(value);
    this.billForm.patchValue({
      tipPercentage: 0,
      predefinedValue: value
    });
  }

  onCustom(): void {
    console.log(this.customValue());
    this.customValue.set(!this.customValue());
    this.updatePredefinedTip(null);
  }
  reset() {
    this.billForm.reset();
    this.customValue.set(false);
    this.updatePredefinedTip(null);
  }


}
