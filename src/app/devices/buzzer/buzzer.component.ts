import { Component, Input } from '@angular/core';
import { Device } from 'src/app/models/device';
import { BuzzerState } from 'src/app/models/deviceState';
import { DeviceService } from 'src/app/service/deviceService/device.service';

@Component({
  selector: 'app-buzzer',
  templateUrl: './buzzer.component.html',
  styleUrls: ['./buzzer.component.css']
})
export class BuzzerComponent {
  @Input() device!: Device<BuzzerState>

  constructor(private deviceService: DeviceService){}

  buzzerTune(text : string){
    this.deviceService.sendAction(this.device.id, this.device.type, {text: text} )
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }

}
