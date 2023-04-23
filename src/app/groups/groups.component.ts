import { Component, Input, OnInit } from '@angular/core';
import { DeviceService } from '../service/deviceService/device.service';
import { Group } from '../models/group';
import { Observable, map } from 'rxjs';
import { groupBy } from 'src/utils';
import { DeviceTypes } from '../models/deviceType';
import { Device } from '../models/device';
import { BuzzerState, DeviceState, FanState, OpenLockState, ScreenState, ToggleState } from '../models/deviceState';
import { NgToastService } from 'ng-angular-popup';
import { state } from '@angular/animations';
import { Type } from '@angular/compiler';
import {MatDialog} from "@angular/material/dialog";
import {EditGroupDialogComponent} from "../edit-group-dialog/edit-group-dialog.component";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit{
  @Input() toggleDevice!: Device<ToggleState>
  @Input() openLockDevice!: Device<OpenLockState>
  @Input() fanDevice!: Device<FanState>
  @Input() screenDevice!: Device<ScreenState>
  @Input() buzzerDevice!: Device<BuzzerState>
  groupsDevices$!: Group[];
  deviceTypes!: String[];
  typeMappedDevices$!: Observable< Record<string, Device<DeviceState>[]>>
  profileId = 'tester@tester.com'; // Profile ID

  selectedDevices: string[] = [];
  selectedType!: string;
  newGroupName!: string;
  newGroupDescription!: string;
  groupId!: string;

  constructor(private deviceService: DeviceService, private toastService: NgToastService, public dialog: MatDialog) {}  // Lägg till profileId här senare

  async ngOnInit() {

    // Get all devices and groups
    const devices = await this.deviceService.getAllDevices();
    const groups: Group[] = await this.deviceService.getGroupsByProfile(this.profileId);
    // Update devices for each group
    await Promise.all(groups.map(async (g: Group) => {
      const foundDevices = await Promise.all(g.devices.map(async (id: string) => {
        const groupId = id.replace(/\s+/g, '');
        const foundDevice = devices.find(device => device.id === groupId);
        return foundDevice;
      }));
      // Filter out if there is any undefined items in the array
      g.devices = foundDevices.filter(device => device !== undefined);
    }));

    this.typeMappedDevices$ =  this.deviceService.devices$.pipe(
      map(devices =>{
        return groupBy(devices, device => device.type)

      })
    )

    // set the groups
    this.groupsDevices$ = groups;
    this.typeMappedDevices$.subscribe(devices => {
      console.log(devices)
      this.deviceTypes = Object.keys(devices)
    })


  }

  addDevice(deviceId:string) {
    this.selectedDevices.push(deviceId);
  }

  clearDevices() {
    this.selectedDevices = []
  }


  submitGroup(name:string, description:string) {
    this.deviceService.createNewGroup({name:name, description:description, devices:this.selectedDevices})
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }

  deleteGroup(groupId:string) {
    console.log("groupId")
    this.deviceService.deleteExistingGroup(groupId)
    .subscribe(() => {
      console.log('Group deleted');
    }, (error) => {
      console.error(error);
    });

  }

  isSelected(deviceId:string) {
    return this.selectedDevices.includes(deviceId)
  }


  getDeviceRuleVar(device:any) { // Set rule for false/true

    switch (device.type) {
      case "toggle":
        return device.state.on
      case "openLock":
        return device.state.open

      default:
        break;
    }

  }

  updateDeviceState(device:any, newValue:boolean) {
    switch (device.type) {
      case "toggle":
        device.state.on = newValue
        break;

      case "openLock":
        device.state.open = newValue
        device.state.locked = !newValue
        break;

      default:
        break;
    }
    return device.state;

  }


  determineGroupState(devices: any[]) { // Iterera genom alla states i devices
    let turnOnDevices = true;
    devices.forEach(element => {
      if (this.getDeviceRuleVar(element.data)) {
        turnOnDevices = false;
        return;

      }

    });
    return turnOnDevices;

  }


  toggleGroupState(group:Group) {

    const turnOnDevices = this.determineGroupState(group.devices)
    console.log("Turning on lights", turnOnDevices)
    group.devices.forEach(device => {
      const newState = this.updateDeviceState(device.data, turnOnDevices)
      console.log(device.data.name, newState)

      this.deviceService.sendAction(device.id, device.data.type, newState)
      .subscribe(() => {
        console.log('sent');
      }, (error) => {
        console.error(error);
      });

    });

  }

  openEditGroupDialog(group: Group): void {
    const dialogRef = this.dialog.open(EditGroupDialogComponent, {
      width: '400px',
      data: {group: JSON.parse(JSON.stringify(group))} // Create a deep copy of the group object
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const index = this.groupsDevices$.findIndex(g => g.id === result.id);
        if (index !== -1) {
          // Update the group locally
          this.groupsDevices$[index] = result;

          // Update the group in the database
          try {
            await this.deviceService.updateGroup(result.id, {
              name: result.name,
              description: result.description,
              devices: result.devices.map((device: { id: string }) => device.id),
            }).toPromise();
            console.log('Group updated successfully');
          } catch (error) {
            console.error('Failed to update group:', error);
          }
        }
      }
    });
  }

}
