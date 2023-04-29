import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.css']
})
export class SensorListComponent {
  @Input() sensors: any[] = [];
}
