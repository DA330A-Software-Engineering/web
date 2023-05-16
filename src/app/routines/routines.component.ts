import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Routine } from '../models/routine'
import { RoutineService } from '../service/routineService/routine.service';
import { DeviceService } from '../service/deviceService/device.service';
import { Observable, lastValueFrom, map, of, take, toArray } from 'rxjs';
import { Group } from '../models/group';
import { Device } from '../models/device';
import { DeviceState } from '../models/deviceState';
import { DeviceTypes } from '../models/deviceType';
import { Action } from '../models/action';
import { AuthService } from '../service/auth/auth.service';
import { TimepickerModule, TimepickerConfig } from 'ngx-bootstrap/timepicker';
import * as cronstrue from 'cronstrue';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.css']
})
export class RoutinesComponent implements OnInit {
  routines$!: Routine<Action>[];
  devices$!: any[];
  profileId!: string;

  newRoutineName: string = "";
  newRoutineDescription: string = "";
  newRoutineTime: string = "0";
  newRoutineDay: number = 0;
  newRoutineRepeatable: boolean = false;
  newRoutineEnabled: boolean = false;
  selectedDevice!: any;
  routineActions: Action[] = [];
  deviceNames: { [key: string]: string} = {};


  constructor(private routineService: RoutineService, private authService: AuthService) { }

  async ngOnInit() {
    this.profileId = this.authService.getEmailFromToken();

    const routines: Routine<Action>[] = await this.routineService.getRoutinesByProfile(this.profileId);
    this.routines$ = routines;

    this.routines$.forEach(routine => {
      const readableTime = cronstrue.toString(routine.schedule, { use24HourTimeFormat: true });
      routine.schedule = readableTime
    })


    var devices: any[] = await this.routineService.getDevices();
    devices = devices.filter((device) => device.type !== "sensor")
    this.devices$ = devices;

    devices.forEach(device => {
      this.deviceNames[device.id] = device.name;
    });
    
  }

  getActionState(action: Action) {
    const state = Object.keys(action.state);
    return state;
  }

  addRoutineAction(id: string, type: string, state: any, value: any) {
    const actionObj: Action = {
      id: id,
      type: type,
      state: {
        [state]: value
      }
    };
    this.routineActions.push(actionObj);
  }

  removeRoutineAction(action: Action) {
    this.routineActions = this.routineActions.filter(a => !Object.is(a, action));
  }

  mergeRoutines() {
    const mergedActions: Action[] = [];
    const mergeIds: string[] = [];

    for (const action of this.routineActions) {
      const { id, state, type } = action;

      if (mergeIds.includes(id)) {
        const existingAction = mergedActions.find((o) => o.id === id);
        if (existingAction) {
          Object.assign(existingAction.state, state);
        }
      } else {
        mergeIds.push(id);
        mergedActions.push({ id, state: { ...state}, type});
      }
    }
    this.routineActions = mergedActions;
  }

  submitRoutine() {
    const date = new Date(this.newRoutineTime)
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const cronjob = `0 ${minutes} ${hours} * * ${this.newRoutineDay}`;
    this.mergeRoutines();
    console.log({name:this.newRoutineName, description:this.newRoutineDescription, schedule:cronjob, repeatable:this.newRoutineRepeatable, enabled:this.newRoutineEnabled, actions:this.routineActions})
    this.routineService.createRoutine({name:this.newRoutineName, description:this.newRoutineDescription, schedule:cronjob, repeatable:this.newRoutineRepeatable, enabled:this.newRoutineEnabled, actions:this.routineActions})
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
