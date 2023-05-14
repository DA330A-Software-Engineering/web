import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

export class EventFormFactory {
  private formBuilder: FormBuilder;

  constructor() {
    this.formBuilder = new FormBuilder();
  }

  createTriggerForm(selectedDeviceType: string): FormGroup {
    return this.formBuilder.group({
      sensor: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0), Validators.max(1023)]],
      condition: ['', Validators.required],
      enabled: ['', Validators.required],
      resetValue: [0, [Validators.required, Validators.min(0), Validators.max(1023)]],
      actions: this.formBuilder.array([
        this.createActionFormGroup(selectedDeviceType),
      ], Validators.required),
    });
  }

  createActionFormGroup(deviceType: string): FormGroup {
    return this.formBuilder.group({
      deviceType: ['', Validators.required],
      deviceId: ['', Validators.required],
      state: this.getStateFormGroup("null"),
    });
  }

  getStateFormGroup(deviceType: string): FormGroup {
    const stateFormGroups: { [key: string]: FormGroup } = {
      toggle: this.formBuilder.group({state: [false, Validators.required]}),

      openLock: this.formBuilder.group({
        locked: [false, Validators.required],
        open: [false, Validators.required],
      }),

      fan: this.formBuilder.group({
        on: [false, Validators.required],
        reverse: [false, Validators.required],
      }),

      screen: this.formBuilder.group({
        on: [false, Validators.required],
        text: ['', [Validators.required, Validators.maxLength(16)]],
      }),

      buzzer: this.formBuilder.group({tune: ['alarm', Validators.required]}),
    };

    return stateFormGroups[deviceType] || this.formBuilder.group({});
  }
}
