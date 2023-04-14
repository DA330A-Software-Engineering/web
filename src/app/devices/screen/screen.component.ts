import { Component, Input } from '@angular/core';
import { Device } from 'src/app/models/device';
import { ScreenState } from 'src/app/models/deviceState';
import { DeviceService } from 'src/app/service/deviceService/device.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent {
  @Input() device!: Device<ScreenState>

  constructor(private deviceService: DeviceService){}

  screenToggleOn(){
    this.deviceService.sendAction(this.device.id, this.device.type, {on: !this.device.state.on} )
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }

  screenToggleText(text : string){
    this.deviceService.sendAction(this.device.id, this.device.type, {text: text} )
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }

    
  getButtonColor(state: boolean): string {
    return state ? 'green' : 'red';
  }

}
