import {Component, Input} from '@angular/core';
import {SensorService} from "../../service/sensor/sensor.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateEventComponent} from "../create-event/create-event.component";
import {DeviceService} from "../../service/deviceService/device.service";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  @Input() userId!: string
  @Input() eventTriggers: any[] = [];
  @Input() sensors: any[] = [];

  devices: any[] = []

  constructor(
    private sensorService: SensorService,
    private deviceService: DeviceService,
    private dialog: MatDialog
  ) {
    this.fetchDevices().then();
  }

  async fetchDevices() {
    this.devices = await this.deviceService.getAllDevices();
  }

  openCreateEventDialog(): void {
    const dialogRef = this.dialog.open(CreateEventComponent, {
      width: '80%',
      data: {sensors: this.sensors, userId: this.userId},
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  getDeviceNameById(deviceId: string): string {
    const device = this.devices.find(device => device.id === deviceId);
    return device ? device.data.name : 'Unknown Device';
  }

  async removeTrigger(triggerId: string): Promise<void> {
    if (!this.userId) {
      console.error('Profile ID not found in token');
      return;
    }

    try {
      await this.sensorService.deleteTrigger(this.userId, triggerId);
    } catch (error) {
      console.error('Error removing trigger:', error);
    }
  }
}
