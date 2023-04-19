import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../service/deviceService/device.service';
import { Group } from '../models/group';
import { Observable, map } from 'rxjs';
import { groupBy } from 'src/utils';
import { DeviceTypes } from '../models/deviceType';
import { Device } from '../models/device';
import { DeviceState } from '../models/deviceState';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit{
  groupsDevices$!: Group[];
  deviceTypes!: String[];
  typeMappedDevices$!: Observable< Record<string, Device<DeviceState>[]>>
  profileId = 'linnea@hotmail.com'; // Profile ID

  selectedDevices: string[] = [];
  selectedType!: string;
  newGroupName!: string;
  newGroupDescription!: string;
  groupId!: string;

  constructor(private deviceService: DeviceService) {}

  async ngOnInit() {

    // Get all devies and groups
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

  deleteGroup(groupId:any) {
    console.log("groupId")
    //console.log(groupId.id)
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

  
}
