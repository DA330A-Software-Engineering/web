import { Injectable } from '@angular/core';
import { DeviceState } from 'src/app/models/deviceState';
import { DeviceTypes } from 'src/app/models/deviceType';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, onSnapshot, query } from '@angular/fire/firestore';
import { Device } from 'src/app/models/device';
import { Type } from '@angular/compiler';
import Constants from 'src/app/constants';

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
    const url = `http://${Constants.ip}:${Constants.port}/devices/actions`;
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
  getGroupsByProfile(profileId: string): Observable<any> {
    const groupCollection = collection(doc(this.firestore, 'profiles', profileId), 'groups');
    const groupQuery = query(groupCollection);

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(groupQuery, (snapshot) => {
        observer.next(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      return () => unsubscribe();
    });
  }


  getAllDevices(): Observable<any> {
    const deviceCollection = collection(this.firestore, 'devices')
    const deviceQuery = query(deviceCollection);

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(deviceQuery, (snapshot) => {
        observer.next(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
      });
      return () => unsubscribe();
    });
  } 
}