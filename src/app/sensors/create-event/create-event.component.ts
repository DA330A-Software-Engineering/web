import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { DeviceTypes } from "../../models/deviceType";
import { SensorService } from "../../service/sensor/sensor.service";
import { DeviceService } from "../../service/deviceService/device.service";
import { EventFormFactory } from "./event-form-factory";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  userId!: string;

  private eventFormFactory: EventFormFactory;

  sensors: any[] = [];
  devices: any[] = [];
  deviceTypes = Object.values(DeviceTypes);

  addTriggerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sensorService: SensorService,
    private deviceService: DeviceService,
    private dialogRef: MatDialogRef<CreateEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sensors: any[]; userId: string }
  ) {
    this.sensors = data.sensors;
    this.userId = data.userId;

    this.initDevices().then(r => {
    });

    this.eventFormFactory = new EventFormFactory();
    this.eventFormFactory = new EventFormFactory();
    this.addTriggerForm = this.eventFormFactory.createTriggerForm(this.deviceTypes[0]);
    this.registerDeviceTypeChange(0);
  }

  get actions(): FormArray {
    return this.addTriggerForm.get('actions') as FormArray;
  }

  addNewAction(): void {
    this.actions.push(this.createActionFormGroup(this.deviceTypes[0]));
    this.registerDeviceTypeChange(this.actions.length - 1);
  }

  removeAction(index: number): void {
    this.actions.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    const formValue = {...this.addTriggerForm.value};
    formValue.condition = formValue.condition === 'greater' ? 'grt' : 'lsr';

    if (!this.userId) {
      console.error('Profile ID not found in token');
      return;
    }

    try {
      await this.sensorService.addEventToProfile(this.userId, formValue);
      this.dialogRef.close();
    } catch (error) {
      console.error('Error saving trigger to the database:', error);
    }
  }

  getStateFormGroup(deviceType: string): FormGroup {
    return this.eventFormFactory.getStateFormGroup(deviceType);
  }

  createActionFormGroup(deviceType: string): FormGroup {
    return this.eventFormFactory.createActionFormGroup(deviceType);
  }

  registerDeviceTypeChange(index: number): void {
    (this.actions.at(index) as FormGroup).get('deviceType')?.valueChanges.subscribe((deviceType: string) => {
      const stateFormGroup = this.getStateFormGroup(deviceType);
      (this.actions.at(index) as FormGroup).setControl('state', stateFormGroup);
    });
  }

  async initDevices() {
    this.devices = await this.deviceService.getAllDevices();
  }

  filteredDevices(): any[] {
    return this.devices.filter(device => this.deviceTypes.includes(device.data.type));
  }

  onDeviceTypeChange(deviceType: string, index: number): void {
    const device = this.filteredDevices().find(device => device.data.type === deviceType);
    if (device) {
      (this.actions.at(index) as FormGroup).get('deviceId')?.setValue(device.id);
    } else {
      console.error('Device not found');
    }
  }
}
