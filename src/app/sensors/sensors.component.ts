import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {DeviceTypes} from '../models/deviceType';
import { DeviceService } from '../service/deviceService/device.service';


@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {
  addTriggerForm: FormGroup;
  deviceTypes = Object.values(DeviceTypes);

  eventTriggers = [
    {
      deviceId: 'device1',
      name: 'Trigger 1',
      description: 'Event trigger description 1',
      condition: 'Temperature > 30',
      value: 30,
      resetValue: 25,
      enabled: true,
      actions: [
        {
          id: 'action1',
          type: 'turn_on',
          state: {on: true},
        },
        {
          id: 'action2',
          type: 'set_color',
          state: {color: 'red'},
        },
      ],
    },
    {
      deviceId: 'device2',
      name: 'Trigger 2',
      description: 'Event trigger description 2',
      condition: 'Temperature < 30',
      value: 30,
      resetValue: 29,
      enabled: false,
      actions: [
        {
          id: 'action1',
          type: 'turn_on',
          state: {on: false, locked: true},
        },
        {
          id: 'action2',
          type: 'set_color',
          state: {color: 'red'},
        },
      ],
    },
  ];
  sensors: any[] = []
  constructor(
    private formBuilder: FormBuilder,
    private deviceService: DeviceService,
    private cdr: ChangeDetectorRef) {
    this.addTriggerForm = this.formBuilder.group({
      sensor: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      value: [0, [Validators.required, Validators.min(0), Validators.max(1023)]],
      condition: ['', Validators.required],
      actions: this.formBuilder.array([
        this.formBuilder.group({
          deviceType: ['', Validators.required],
          state: [''],
        }),
      ]),
    });
  }

  async ngOnInit(): Promise<void> {
  const allDevices = await this.deviceService.getAllDevices();
  this.sensors = allDevices.filter(device => device.data.type === 'sensor');
  this.cdr.detectChanges();
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

  onSubmit(): void {
    console.log(this.addTriggerForm.value);
    this.eventTriggers.push(this.addTriggerForm.value)
  }
}
