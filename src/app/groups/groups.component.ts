import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceService } from '../service/deviceService/device.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit{
  groups$!: Observable<any>;
  profileId = 'PbzEcJhIcv06ybA6BUWx'; // Profile ID

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.groups$ = this.deviceService.getGroupsByProfile(this.profileId);
  }
}