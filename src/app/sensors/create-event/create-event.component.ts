import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
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
    this.addTriggerForm = this.formBuilder.group({
      sensor: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      value: [0, [Validators.required, Validators.min(0), Validators.max(1023)]],
      condition: ['', Validators.required],
      resetValue: [0, [Validators.required, Validators.min(0), Validators.max(1023)]],
      actions: this.formBuilder.array([
        this.formBuilder.group({
          deviceType: ['', Validators.required],
          state: [''],
        }),
      ]),
    });
  }

  get actions(): FormArray {
    return this.addTriggerForm.get('actions') as FormArray;
  }

  addNewAction(): void {
    console.log(this.sensors)
    this.actions.push(
      this.formBuilder.group({
        deviceType: ['', Validators.required],
        state: [''],
      }),
    );
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

}
