import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceService } from '../service/deviceService/device.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit{
  groupsDevices$!: any[];
  profileId = 'PbzEcJhIcv06ybA6BUWx'; // Profile ID

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.groupsDevices$ = []

    const allDevices = this.deviceService.getAllDevices();
    
    const groups = this.deviceService.getGroupsByProfile(this.profileId);

    groups.subscribe((data:any[]) => {
      data.forEach((group: any) => {
        group["devicesNames"] = []
        allDevices.subscribe((data: any[]) => {
            data.forEach((device: any) => {
              const id = " " + device["id"]
              if (group["devices"].includes(id)) {
                group["devicesNames"].push(device["name"])
              }
            })
        })

    })
    this.groupsDevices$ = data
    console.log(this.groupsDevices$)

    })
  }
  
}