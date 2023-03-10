import { Component, Input } from '@angular/core';
import { Device } from '../../models/device';
import { DoorState } from '../../models/deviceState';
import { DeviceService } from '../../service/deviceService/device.service';

@Component({
  selector: 'app-door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.css']
})
export class DoorComponent {
  @Input() device!: Device<DoorState>

  constructor(private deviceService: DeviceService){}

  toggleLocked(){
    this.deviceService.sendAction(this.device.id, this.device.type, {locked: !this.device.state.locked} )
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }

  toggleOpen() {
    this.deviceService.sendAction(this.device.id, this.device.type, {open: !this.device.state.open} )
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }
}
