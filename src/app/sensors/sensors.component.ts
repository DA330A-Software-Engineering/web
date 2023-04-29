import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DeviceService } from '../service/deviceService/device.service';
import { SensorService } from "../service/sensor/sensor.service";
import { AuthService } from "../service/auth/auth.service";

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {
  userId: string;
  eventTriggers: any[] = [];
  sensors: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private deviceService: DeviceService,
    private cdr: ChangeDetectorRef,
    private sensorService: SensorService,
    private authService: AuthService
  ) {
    this.userId = this.getUserIdFromAuthService();
  }

  async ngOnInit(): Promise<void> {
    await this.fetchSensors();
    this.listenToTriggers();
  }

  private getUserIdFromAuthService(): string {
    return this.authService.getEmailFromToken();
  }

  private async fetchSensors(): Promise<void> {
    const allDevices = await this.deviceService.getAllDevices();
    this.sensors = this.filterSensors(allDevices);
    this.cdr.detectChanges();
  }

  private filterSensors(devices: any[]): any[] {
    return devices.filter(device => device.data.type === 'sensor');
  }

  private listenToTriggers(): void {
    this.sensorService.listenToTriggersByProfile(this.userId).subscribe((triggers) => {
      this.eventTriggers = triggers;
    });
  }
}
