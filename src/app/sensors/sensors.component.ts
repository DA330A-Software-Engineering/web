import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {DeviceTypes} from '../models/deviceType';
import {DeviceService} from '../service/deviceService/device.service';
import {SensorService} from "../service/sensor/sensor.service";
import {AuthService} from "../service/auth/auth.service";


@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {
  deviceTypes = Object.values(DeviceTypes);

  userId: string;

  eventTriggers: any[] = [];
  sensors: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private deviceService: DeviceService,
    private cdr: ChangeDetectorRef,
    private sensorService: SensorService,
    private authService: AuthService) {

    this.userId = this.authService.getEmailFromToken()
  }

  async ngOnInit(): Promise<void> {
    const allDevices = await this.deviceService.getAllDevices();
    this.sensors = allDevices.filter(device => device.data.type === 'sensor');
    this.cdr.detectChanges();

    this.sensorService.listenToTriggersByProfile(this.userId).subscribe((triggers) => {
      this.eventTriggers = triggers
    })
  }

}
