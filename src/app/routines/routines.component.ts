import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Routine } from '../models/routine'
import { RoutineService } from '../service/routineService/routine.service';
import { DeviceService } from '../service/deviceService/device.service';
import { Observable, map, of, take, toArray } from 'rxjs';
import { Group } from '../models/group';
import { Device } from '../models/device';
import { DeviceState } from '../models/deviceState';
import { DeviceTypes } from '../models/deviceType';
import { Action } from '../models/action';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.css']
})
export class RoutinesComponent implements OnInit {
  routines$!: Routine<Action>[];
  devices$!: Observable<Device<DeviceState>[]>;

  profileId = 'simon@gmail.com'; // Hardcoded profile

  newRoutineName: string = "";
  newRoutineDescription: string = "";
  newRoutineSchedule: string = "";
  newRoutineRepeatable: boolean = false;
  newRoutineEnabled: boolean = false;
  selectedDevice!: any;
  routineActions: Action[] = [];
  deviceNames: { [key: string]: string} = {};


  constructor(private routineService: RoutineService, private deviceService: DeviceService) { }

  async ngOnInit() {
    const routines: Routine<Action>[] = await this.routineService.getRoutinesByProfile(this.profileId);
    this.routines$ = routines;
    console.log(routines)

    
    this.devices$ = this.deviceService.devices$;
    this.devices$.subscribe(devices => {
      console.log(devices)
      devices.forEach(device => {
        this.deviceNames[device.id] = device.name;
      });
      console.log(this.deviceNames)
    });
  }

  getActionState(action: Action) {
    const state = Object.keys(action.state);
    return state;
  }

  addRoutineAction(id: string, type: string, state: any, value: any) {
    console.log(id, type, state, value)
    const actionObj: Action = {
      id: id,
      type: type,
      state: {
        [state]: value
      }
    };
    console.log(actionObj)
    this.routineActions.push(actionObj);
    console.log(this.routineActions)
  }

  removeRoutineAction(action: Action) {
    this.routineActions = this.routineActions.filter(a => !Object.is(a, action));
  }

  submitRoutine(name: string, description: string, schedule: string, repeatable: boolean, enabled: boolean) {
    this.routineService.createRoutine({name:name, description:description, schedule:schedule, repeatable:repeatable, enabled:enabled, actions:this.routineActions})
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }

  removeRoutine(routineId: string) {
    this.routineService.removeRoutine(routineId)
    .subscribe(() => {
      console.log('Routine removed')
    }, (error) => {
      console.error(error);
    });
  }
}
