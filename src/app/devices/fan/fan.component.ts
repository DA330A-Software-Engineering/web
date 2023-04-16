import { Component, Input } from '@angular/core';
import { FanState } from 'src/app/models/deviceState';
import { DeviceService } from 'src/app/service/deviceService/device.service';
import { Device } from '../../models/device';
import { getOnButtonText } from 'src/app/constants';

@Component({
  selector: 'app-fan',
  templateUrl: './fan.component.html',
  styleUrls: ['./fan.component.css']
})
export class FanComponent {
  @Input() device!: Device<FanState>

  constructor(private deviceService: DeviceService){}

  fanToggleOn(){
    this.deviceService.sendAction(this.device.id, this.device.type, {on: !this.device.state.on} )
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }

  fanToggleReverse(){
    this.deviceService.sendAction(this.device.id, this.device.type, {reverse: !this.device.state.reverse} )
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });

  }

  getButtonColor(state: boolean): string {
    return state ? 'green' : 'red';
  }

  getOnButtonText(): string {
    return getOnButtonText(this.device.state.on);
  }
  
}
