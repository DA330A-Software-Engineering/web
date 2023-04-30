import { Component, Input } from '@angular/core';
import { SensorService } from "../../service/sensor/sensor.service";
import { MatDialog } from "@angular/material/dialog";
import {CreateEventComponent} from "../create-event/create-event.component";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  @Input() userId!: string
  @Input() eventTriggers: any[] = [];
  @Input() sensors: any[] = [];

  constructor(private sensorService: SensorService, private dialog: MatDialog) {
  }

  openCreateEventDialog(): void {
    const dialogRef = this.dialog.open(CreateEventComponent, {
      width: '80%',
      data: { sensors: this.sensors, userId: this.userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
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
