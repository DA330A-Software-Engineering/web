import { Component, Input, OnInit } from '@angular/core';
import { getOnButtonText } from 'src/app/constants';
import { Device } from 'src/app/models/device';
import { ScreenState } from 'src/app/models/deviceState';
import { DeviceService } from 'src/app/service/deviceService/device.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit{
  @Input() device!: Device<ScreenState>
  inputValue: string = '';

  constructor(private deviceService: DeviceService){}

  ngOnInit(): void {
    this.inputValue = localStorage.getItem('inputValue') || '';
  }
  
  
  screenToggleOn(){
    this.deviceService.sendAction(this.device.id, this.device.type, {on: !this.device.state.on} )
    .subscribe(() => {
      console.log('sent');
    }, (error) => {
      console.error(error);
    });
  }

  screenToggleText(){
    this.deviceService.sendAction(this.device.id, this.device.type, {text: this.inputValue} )
    .subscribe(() => {
      console.log('sent');
      this.clearStorage();
    }, (error) => {
      console.error(error);
    });
  }

    
  getButtonColor(state: boolean): string {
    return state ? 'green' : 'red';
  }

  storeInputValue(): void {
    localStorage.setItem('inputValue', this.inputValue);
  }

  clearStorage(): void {
    localStorage.removeItem('inputValue');
  }

  getOnButtonText(): string {
    return getOnButtonText(this.device.state.on);
  }
  
  

}
