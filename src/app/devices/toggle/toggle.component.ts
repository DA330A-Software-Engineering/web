import { Component, Input } from '@angular/core';
import { Device } from 'src/app/models/device';
import { ToggleState } from 'src/app/models/deviceState';
import { DeviceService } from '../../service/deviceService/device.service';
import { getOnButtonText } from 'src/app/constants';


@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css']
})

export class ToggleComponent {

  @Input() device!: Device<ToggleState>

  constructor(private deviceService: DeviceService){}

  toggle(){
    this.deviceService.sendAction(this.device.id, this.device.type, {on: !this.device.state.on} )
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
