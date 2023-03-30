import { Component, Input } from '@angular/core';
import { Device } from 'src/app/models/device';
import { WindowState } from 'src/app/models/deviceState';
import { DeviceService } from 'src/app/service/deviceService/device.service';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent {
  @Input() device!: Device<WindowState>

  constructor(private deviceService: DeviceService){}

  windowToggleOpen(){
    this.deviceService.sendAction(this.device.id, this.device.type, {open: !this.device.state.open} )
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }

  windowToggleLocked(){
    this.deviceService.sendAction(this.device.id, this.device.type, {locked: !this.device.state.locked} )
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }
}
