import {Component, Input} from '@angular/core';
import {SensorService} from "../../service/sensor/sensor.service";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  @Input() userId!: string
  @Input() eventTriggers: any[] = [];

  constructor(private sensorService: SensorService,) {
  }

  async removeTrigger(triggerId: string): Promise<void> {
  if (this.userId) {
    try {
      await this.sensorService.deleteTrigger(this.userId, triggerId);
      console.log('Trigger successfully removed');
    } catch (error) {
      console.error('Error removing trigger:', error);
    }
  } else {
    console.error('Profile ID not found in token');
  }
}

}
