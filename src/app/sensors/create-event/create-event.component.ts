import {Component, Inject} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import {DeviceTypes} from "../../models/deviceType";
import {SensorService} from "../../service/sensor/sensor.service";
import {DeviceService} from "../../service/deviceService/device.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  userId!: string;

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

    this.initDevices().then(r => {})
    this.addTriggerForm = this.createTriggerForm(this.deviceTypes[0]);
    this.registerDeviceTypeChange(0);
  }

  get actions(): FormArray {
    return this.addTriggerForm.get('actions') as FormArray;
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
      deviceType: [deviceType, Validators.required],
      state: this.getStateFormGroup(deviceType),
    });
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
      await this.sensorService.addTriggerToProfile(this.userId, formValue);
      this.dialogRef.close();
    } catch (error) {
      console.error('Error saving trigger to the database:', error);
    }
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
}
