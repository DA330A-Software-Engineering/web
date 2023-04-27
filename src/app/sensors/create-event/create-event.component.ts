import {Component, Input, OnInit} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import {DeviceTypes} from "../../models/deviceType";
import {SensorService} from "../../service/sensor/sensor.service";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  @Input() userId!: string;
  @Input() sensors: any[] = [];

  addTriggerForm: FormGroup;
  deviceTypes = Object.values(DeviceTypes);

  constructor(
    private formBuilder: FormBuilder,
    private sensorService: SensorService
  ) {
    const selectedDeviceType = this.deviceTypes[0];
    this.addTriggerForm = this.formBuilder.group({
      sensor: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      value: [0, [Validators.required, Validators.min(0), Validators.max(1023)]],
      condition: ['', Validators.required],
      resetValue: [0, [Validators.required, Validators.min(0), Validators.max(1023)]],
      actions: this.formBuilder.array([
        this.formBuilder.group({
          deviceType: [selectedDeviceType, Validators.required],
          state: this.getStateFormGroup(selectedDeviceType),
        }),
      ], Validators.required),
    });

    this.registerDeviceTypeChange(0);
  }

  get actions(): FormArray {
    return this.addTriggerForm.get('actions') as FormArray;
  }

  addNewAction(): void {
    const selectedDeviceType = this.deviceTypes[0]; // Set the default selected device type
    const newIndex = this.actions.length;
    this.actions.push(
      this.formBuilder.group({
        deviceType: [selectedDeviceType, Validators.required],
        state: this.getStateFormGroup(selectedDeviceType),
      }),
    );
    this.registerDeviceTypeChange(newIndex);
  }


  removeAction(index: number): void {
    this.actions.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    const formValue = {...this.addTriggerForm.value};

    if (formValue.condition === 'greater') {
      formValue.condition = 'grt';
    } else if (formValue.condition === 'lesser') {
      formValue.condition = 'lsr';
    }

    console.log(formValue);

    if (this.userId) {
      try {
        await this.sensorService.addTriggerToProfile(this.userId, formValue);
        console.log('Trigger successfully saved to the database');
      } catch (error) {
        console.error('Error saving trigger to the database:', error);
      }
    } else {
      console.error('Profile ID not found in token');
    }
  }

  // @ts-ignore
  getStateFormGroup(deviceType: string): FormGroup {
    switch (deviceType) {
      case 'toggle':
        return this.formBuilder.group({
          state: [false, Validators.required],
        });

      case 'openLock':
        return this.formBuilder.group({
          locked: [false, Validators.required],
          open: [false, Validators.required],
        });

      case 'fan':
        return this.formBuilder.group({
          on: [false, Validators.required],
          reverse: [false, Validators.required],
        });

      case 'screen':
        return this.formBuilder.group({
          on: [false, Validators.required],
          text: ['', [Validators.required, Validators.maxLength(16)]],
        });

      case 'buzzer':
        return this.formBuilder.group({
          tune: ['alarm', Validators.required],
        });
    }
  }

  registerDeviceTypeChange(index: number): void {
    (this.actions.at(index) as FormGroup).get('deviceType')?.valueChanges.subscribe((deviceType: string) => {
      const stateFormGroup = this.getStateFormGroup(deviceType);
      (this.actions.at(index) as FormGroup).setControl('state', stateFormGroup);
    });
  }
}
