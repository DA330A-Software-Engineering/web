import { Injectable } from '@angular/core';
import { DeviceState } from 'src/app/models/deviceState';
import { DeviceTypes } from 'src/app/models/deviceType';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Device } from 'src/app/models/device';
import { Type } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  devices$!: Observable<Device<DeviceState>[]>

  constructor(private http: HttpClient, private firestore: Firestore) {
    this.getData();
  }

  sendAction(id: string, type: DeviceTypes, state: DeviceState): Observable<any> {
    const action = {
      id, type, state
    }
    const url = `http://localhost:3000/devices/actions`;
    return this.http.put(url, action)
  }

  getData() {
    const collectionInstance = collection(this.firestore, 'devices');

    this.devices$ = collectionData(collectionInstance, { idField: 'id' })
      .pipe(map(collection => {
        return collection.map(deviceDoc => {
          return new Device(deviceDoc['id'], deviceDoc['available'], deviceDoc['type'], deviceDoc['state'], deviceDoc['name'], deviceDoc['description'])

        });
      }));
  }
}
