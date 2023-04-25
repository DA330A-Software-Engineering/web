import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {DeviceTypes} from '../models/deviceType';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {
  addTriggerForm: FormGroup;
  deviceTypes = Object.values(DeviceTypes);

  sensors = [
    {name: 'Sensor 1', value: '25°C'},
    {name: 'Sensor 2', value: '30°C'},
    {name: 'Sensor 3', value: '13°C'},
    {name: 'Sensor 4', value: '1°C'},
    {name: 'Sensor 5', value: '-199°C'},
    {name: 'Sensor 6', value: '56°C'},
    {name: 'Sensor 7', value: '82°C'},
    {name: 'Sensor 8', value: '28°C'},
    // Add more sensors as needed
  ];

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

  constructor(private formBuilder: FormBuilder) {
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

  get actions(): FormArray {
    return this.addTriggerForm.get('actions') as FormArray;
  }

  addNewAction(): void {
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

  ngOnInit(): void {
  }
}
