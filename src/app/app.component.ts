import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';


export function tipRequiredValidator(control: AbstractControl): ValidationErrors | null {
  const predefinedValue = control.get('predefinedValue')?.value;
  const tipPercentage = control.get('tipPercentage')?.value;

  if (!predefinedValue && !tipPercentage) {
    return { tipRequired: true };
  }
  return null;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit{
  title = 'tip-calculator';
  splitAmount = 0;
  totalAmount= 0;
  splitPerPerson= 0;
  customValue = false;
  predefinedValues: number[] = [5, 10, 15, 25, 50];
  selectedPredefinedTip: number | null = null;

  billForm = new FormGroup({
    billAmount: new FormControl<number | null>(null, [
      Validators.required, Validators.min(0.01)]),
    tipPercentage: new FormControl<number | null>(null, [Validators.min(0.01)]),
    predefinedValue: new FormControl<number | null>(null),
    peopleQty: new FormControl<number | null>(null, [
      Validators.required, Validators.min(1)]),
  }, { validators: tipRequiredValidator });



  ngOnInit(): void {
    this.billForm.valueChanges.subscribe(() => {
      this.onSubmit();
    });
  }
  onButtonClick(value: number): void {
    this.customValue = false;
    const tipControl = this.billForm.get('tipPercentage');
    if (tipControl) {
      tipControl.setValue(0);
    }
    this.selectedPredefinedTip = value;
    this.billForm.patchValue({
      predefinedValue: value
    });
  }

  onCustom() {
    this.customValue = !this.customValue;
    this.selectedPredefinedTip = 0;
  }
  reset() {
    this.billForm.reset();
    this.customValue = false;
    this.splitAmount = 0;
    this.splitPerPerson = 0;
    this.totalAmount = 0;
  }
  onSubmit() {
    const billAmount = this.billForm.get('billAmount')?.value;
    const tipPercentage = this.billForm.get('tipPercentage')?.value || this.billForm.get('predefinedValue')?.value;
    const peopleQty = Number(this.billForm.get('peopleQty')?.value);
    if (billAmount && tipPercentage && peopleQty > 0) {
      this.splitAmount = (billAmount * tipPercentage) / 100;
      this.splitPerPerson = this.splitAmount / peopleQty;
      this.totalAmount = (billAmount / peopleQty) + this.splitPerPerson;
    }
  }

}
