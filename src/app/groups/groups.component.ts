import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../service/deviceService/device.service';
import { Group } from '../models/group';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit{
  groupsDevices$!: Group[];
  profileId = 'PbzEcJhIcv06ybA6BUWx'; // Profile ID

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
    // set the groups
    this.groupsDevices$ = groups;
  }
  
}