import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DeviceService} from '../service/deviceService/device.service';
import {SensorService} from "../service/sensor/sensor.service";
import {AuthService} from "../service/auth/auth.service";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

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

  ngOnInit(): void {
    this.fetchSensors();
    this.listenToTriggers();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


  private getUserIdFromAuthService(): string {
    return this.authService.getEmailFromToken();
  }

  private fetchSensors(): void {
    this.deviceService.sensors$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((sensors) => {
        this.sensors = this.filterSensors(sensors);
        this.cdr.detectChanges();
      });
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
