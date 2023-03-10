import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DeviceTypes } from '../../models/deviceType';
import { DeviceState, ToggleState } from '../../models/deviceState';
import { DeviceService } from '../../service/deviceService/device.service';

@Component({
  selector: 'app-device-container',
  templateUrl: './device-container.component.html',
  styleUrls: ['./device-container.component.css']
})
export class DeviceContainerComponent {
  devices!: Observable<any>
  toggleType = DeviceTypes.TOGGLE
  doorType = DeviceTypes.DOOR

  constructor(private deviceService: DeviceService) {
    this.devices = deviceService.devices$;
  }
}
